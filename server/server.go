package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/gorilla/websocket"
	"github.com/s4y/reserve"
)

type WhichServer int

const (
	PublicServer WhichServer = iota
	AdminServer
	ScreenServer
)

type Role int

const (
	RoleReceiveBroadcasts Role = iota
	RoleSendBroadcasts
	RoleReadState
	RoleWriteState
	RoleReceiveDocentBroadcasts
	RoleSendDocentBroadcasts
	RoleReceiveConfetti
)

type NameValueMessage struct {
	Name  string      `json:"name"`
	Value interface{} `json:"value"`
}

type Client struct {
	ch    chan NameValueMessage
	roles Role
}

type Clients struct {
	clients []*Client
	mutex   sync.RWMutex
}

func (c *Clients) Get(f func([]*Client)) {
	c.mutex.RLock()
	defer c.mutex.RUnlock()
	f(c.clients)
}

func (c *Clients) Add(client *Client) {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	c.clients = append(c.clients, client)
}

func (c *Clients) Remove(client *Client) {
	c.mutex.Lock()
	defer c.mutex.Unlock()
	for i, cur := range c.clients {
		if cur == client {
			c.clients = append(c.clients[:i], c.clients[i+1:]...)
			break
		}
	}
}

type Store struct {
	store map[string]interface{}
	mutex sync.RWMutex
}

func (s *Store) Set(changes map[string]interface{}) {
	s.mutex.Lock()
	if s.store == nil {
		s.store = make(map[string]interface{})
	}
	for k, v := range changes {
		if v == nil {
			delete(s.store, k)
		} else {
			s.store[k] = v
		}
	}
	s.mutex.Unlock()
}

func (s *Store) Get() map[string]interface{} {
	ret := make(map[string]interface{})
	s.mutex.RLock()
	for k, v := range s.store {
		ret[k] = v
	}
	s.mutex.RUnlock()
	return ret
}

type persistFile struct {
	mu       sync.RWMutex
	filename string
}

var confettiFile = &persistFile{filename: "../confetti.json"}

func persist(f *persistFile, obj interface{}) error {
	f.mu.Lock()
	defer f.mu.Unlock()

	file, err := os.OpenFile(f.filename, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer file.Close()

	data, err := json.Marshal(obj)
	if err != nil {
		return err
	}

	_, err = file.Write(append(data, '\n'))
	if err != nil {
		return err
	}

	return nil
}

var production bool

func startServer(addr string, staticDir http.Dir, setup func(*http.ServeMux)) {
	mux := http.NewServeMux()
	var handler http.Handler
	if production {
		handler = http.FileServer(staticDir)
	} else {
		handler = reserve.FileServer(staticDir)
	}

	mux.Handle("/", handler)
	server := http.Server{Addr: addr, Handler: mux}

	setup(mux)

	log.Fatal(server.ListenAndServe())
}

func main() {
	// staticDir := "../static-public"
	staticAdminDir := "../static-admin"
	staticScreenDir := "../static"

	httpAddr := flag.String("http", "127.0.0.1:8021", "Listening address (public)")
	adminAddr := flag.String("http-admin", "127.0.0.1:8022", "Listening address for admin site")
	screenAddr := flag.String("http-screens", "127.0.0.1:8023", "Listening address for screens, etc.")
	flag.BoolVar(&production, "p", false, "Production mode (disables hot reloading, more normal caching behavior)")
	flag.Parse()
	fmt.Printf("Screens: http://%s/\n", *screenAddr)
	fmt.Printf("Public:  http://%s/\n", *httpAddr)
	fmt.Printf("Admin:   http://%s/\n", *adminAddr)

	var clients Clients

	state := Store{}

	broadcast := func(msg NameValueMessage, role Role, except *Client) {
		clients.Get(func(clients []*Client) {
			for _, c := range clients {
				if (except != c) && (0 != c.roles&(1<<role)) {
					c.ch <- msg
				}
			}
		})
	}

	upgrader := websocket.Upgrader{}

	makeHandler := func(which WhichServer) func(mux *http.ServeMux) {
		return func(mux *http.ServeMux) {
			mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
				conn, err := upgrader.Upgrade(w, r, nil)
				defer conn.Close()
				if err != nil {
					return
				}
				c := Client{
					ch: make(chan NameValueMessage, 5),
				}
				defer close(c.ch)
				if which == PublicServer {
					// changes := make(map[string]interface{})
					// changes["sessionKey"] = nil
					// state.Set(changes)

					// c.roles |= 1 << RoleSendBroadcasts
					// c.roles |= 1 << RoleReadState
					// c.roles |= 1 << RoleWriteState
				} else if which == ScreenServer {
					c.roles |= 1 << RoleReceiveDocentBroadcasts
					c.roles |= 1 << RoleReceiveConfetti
					c.roles |= 1 << RoleReceiveBroadcasts
					c.roles |= 1 << RoleSendBroadcasts
					c.roles |= 1 << RoleReadState
					c.roles |= 1 << RoleWriteState
				} else if which == AdminServer {
					c.roles |= 1 << RoleReceiveBroadcasts
					c.roles |= 1 << RoleSendBroadcasts
					c.roles |= 1 << RoleSendDocentBroadcasts
					c.roles |= 1 << RoleReadState
					c.roles |= 1 << RoleWriteState
				}
				clients.Add(&c)
				defer clients.Remove(&c)

				go func() {
					for msg := range c.ch {
						conn.WriteJSON(msg)
					}
					conn.Close()
				}()

				if 0 != c.roles&(1<<RoleReadState) {
					conn.WriteJSON(NameValueMessage{"state", state.Get()})
				}
				for {
					var msg NameValueMessage
					if err = conn.ReadJSON(&msg); err != nil {
						break
					}
					if msg.Name == "setState" {
						if 0 == c.roles&(1<<RoleWriteState) {
							break
						}
						inner, ok := msg.Value.(map[string]interface{})
						if !ok {
							break
						}
						state.Set(inner)
						broadcast(NameValueMessage{"state", inner}, RoleReadState, &c)
					} else if msg.Name == "docent" {
						if 0 == c.roles&(1<<RoleSendDocentBroadcasts) {
							break
						}
						broadcast(msg, RoleReceiveDocentBroadcasts, nil)
					} else if msg.Name == "broadcast" {
						if 0 == c.roles&(1<<RoleSendBroadcasts) {
							break
						}
						broadcast(msg, RoleReceiveBroadcasts, &c)
					} else {
						fmt.Println("unknown message from client:", msg)
					}
				}
			})
		}
	}

	go (func() {
		mux := http.NewServeMux()
		mux.HandleFunc("/write/submitConfetti", func(w http.ResponseWriter, r *http.Request) {
			if r.Method != http.MethodPost {
				http.Error(w, "", http.StatusMethodNotAllowed)
				return
			}

			type confettum struct {
				Prompt string `json:"prompt"`
				Reply  string `json:"reply"`
			}

			c := confettum{r.FormValue("prompt"), r.FormValue("reply")}

			persist(confettiFile, struct {
				Timestamp string `json:"timestamp"`
				confettum
			}{time.Now().UTC().String(), c})

			broadcast(NameValueMessage{"confettum", c}, RoleReceiveConfetti, nil)
		})
		server := http.Server{Addr: *httpAddr, Handler: mux}
		log.Fatal(server.ListenAndServe())
	})()
	// go startServer(*httpAddr, http.Dir(staticDir), makeHandler(PublicServer))
	go startServer(*adminAddr, http.Dir(staticAdminDir), makeHandler(AdminServer))
	go startServer(*screenAddr, http.Dir(staticScreenDir), makeHandler(ScreenServer))

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	<-sigs
}
