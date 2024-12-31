run:
	cd server && go run .

static/countdown_videos: $(foreach f,$(wildcard static/countdown_videos_orig/*),static/countdown_videos/$(notdir $f).mp4)

static/countdown_videos/%.mp4: static/countdown_videos_orig/%
	# mkdir -p $(dir $@)
	ffmpeg -y -i "$<" -profile:v main -an -pix_fmt yuv420p -lavfi "scale='if(lt(iw/(4/3),ih),640*4/3,-2)':'if(lt(iw/(4/3),ih),-2,480)' , crop='640:480'" "$@" || rm "$@"
