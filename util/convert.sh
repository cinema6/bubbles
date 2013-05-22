LIST=`ls *.mp4`
for srcVideo in $LIST
do
    tgtVideo=`echo ${srcVideo} | sed 's/\.mp4/.webm/g'`;
    echo ${tgtVideo};
    ffmpeg -i ${srcVideo} -s 1280x720 -vpre libvpx-720p -b:v 3900k -pass 1 \
        -an -f webm -y ${tgtVideo}
    ffmpeg -i ${srcVideo} -s 1280x720 -vpre libvpx-720p -b:v 3900k -pass 2 \
        -acodec libvorbis -b:a 100k -f webm -y ${tgtVideo}
done

