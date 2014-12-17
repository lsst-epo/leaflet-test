Mockup of using leaflet.js to display astronomical images
===

This repo is a mockup of using the [leaflet.js](http://leafletjs.com/) GIS
library to render tileized astronomical data in a web browser.

The [Slippy map
tilenames](http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames) tiling
strategy is used due to leaflet.js' out of the box support for it.  The
[Mercator](https://en.wikipedia.org/wiki/Mercator_projection) projection used
by slippy map is unsuitable for navigation by sky coordinates and would need to
be replaced for usage with properly registered data.

The test data used is a [3 color
mosaic](https://s3.amazonaws.com/lsst-epo/testdata/D4.rgb.q95.jpg) created by
@taxelrod that has been cut up into tiles at multiple resolutions.  Slippy map
defines all tiles as 256x256 pixels and has the concept of a "zoom level".
Where zoom is an integer value that implies the total number of tiles at that
level.  Eg., a zoom level of 3 has 2^3 == 16 tiles arranged in a 4x4 grid.

The test image is cropped to 16384x16384 pixels so that it will evenly divide
into powers of 2 numbers of tiles.  It is then scaled to 7 different zoom
levels (0-6) ranging from 256^2px .. 16384^2px which are in turn cut into
256^2px tiles.

Generating the Tiles
---

No image data is committed to the repo.  A `makefile` is provided that will
download the test image and process it into slippy map compatible tiles.  The
[imagemagick](http://www.imagemagick.org/) `convert` utility is required to
generate the tiles and [`wget`](https://www.gnu.org/software/wget/) is used to
download the test image.

the tiles will consume multiple gigabytes of resident memory. __Be sure that
your system has enough available RAM__

```
git clone git@github.com:LSST-EPO/leaflet-test.git
cd leaflet-test/img
make
```

Example output from invoking the default `make` target:

```
[master] ~/tmp/leaflet-test/img $ make
wget https://s3.amazonaws.com/lsst-epo/testdata/D4.rgb.q95.jpg
--2014-12-17 10:51:43--  https://s3.amazonaws.com/lsst-epo/testdata/D4.rgb.q95.jpg
Resolving s3.amazonaws.com (s3.amazonaws.com)... 54.231.244.8
Connecting to s3.amazonaws.com (s3.amazonaws.com)|54.231.244.8|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 41445972 (40M) [image/jpeg]
Saving to: ‘D4.rgb.q95.jpg’

D4.rgb.q95.jpg                          100%[===============================================================================>]  39.53M  2.37MB/s   in 18s    

2014-12-17 10:52:01 (2.26 MB/s) - ‘D4.rgb.q95.jpg’ saved [41445972/41445972]

convert D4.rgb.q95.jpg -crop 16384x16384+0+0 squared-6.jpg
convert squared-6.jpg -resize 8192x8192 squared-5.jpg
convert squared-5.jpg -resize 4096x4096 squared-4.jpg
convert squared-4.jpg -resize 2048x2048 squared-3.jpg
convert squared-3.jpg -resize 1024x1024 squared-2.jpg
convert squared-2.jpg -resize 512x512 squared-1.jpg
convert squared-1.jpg -resize 256x256 squared-0.jpg
mkdir -p 0
convert squared-0.jpg -crop 256x256 -set filename:tile '%[fx:page.x/256]_%[fx:page.y/256]' +repage +adjoin 0/'foo_%[filename:tile].jpg'
mkdir -p 1
convert squared-1.jpg -crop 256x256 -set filename:tile '%[fx:page.x/256]_%[fx:page.y/256]' +repage +adjoin 1/'foo_%[filename:tile].jpg'
mkdir -p 2
convert squared-2.jpg -crop 256x256 -set filename:tile '%[fx:page.x/256]_%[fx:page.y/256]' +repage +adjoin 2/'foo_%[filename:tile].jpg'
mkdir -p 3
convert squared-3.jpg -crop 256x256 -set filename:tile '%[fx:page.x/256]_%[fx:page.y/256]' +repage +adjoin 3/'foo_%[filename:tile].jpg'
mkdir -p 4
convert squared-4.jpg -crop 256x256 -set filename:tile '%[fx:page.x/256]_%[fx:page.y/256]' +repage +adjoin 4/'foo_%[filename:tile].jpg'
mkdir -p 5
convert squared-5.jpg -crop 256x256 -set filename:tile '%[fx:page.x/256]_%[fx:page.y/256]' +repage +adjoin 5/'foo_%[filename:tile].jpg'
mkdir -p 6
convert squared-6.jpg -crop 256x256 -set filename:tile '%[fx:page.x/256]_%[fx:page.y/256]' +repage +adjoin 6/'foo_%[filename:tile].jpg'
```


Displaying locally
---

As only static content is used, the `index.html` at the top level of the repo
can be viewed directly with a local web browser. Eg.,

```
[master] ~/tmp/leaflet-test $ firefox index.html 
```


Deploying to AWS s3
---

### Install s3cmd

The [`s3cmd`](http://s3tools.org/s3cmd) utility is a convenient tool for small
scale interaction with s3.

    yum install -y s3cmd

or

    yum install -y http://s3tools.org/repo/RHEL_6/x86_64/s3cmd-1.0.0-4.1.x86_64.rpm

### Configure s3cmd

    s3cmd --configure

See the [s3cmd-howto](http://s3tools.org/s3cmd-howto) for details.

### Push to s3

Create a new s3 bucket to host the mockup and push the repo + generated tiles
to it.

```shell
[master] ~/epo/maptest/leaflet-test $ s3cmd mb s3://epo-leaflet-test1
Bucket 's3://epo-leaflet-test1/' created
[master] ~/epo/maptest/leaflet-test $ s3cmd sync --acl-public . s3://epo-leaflet-test1
./.README.md.swp -> s3://epo-leaflet-test1/.README.md.swp  [1 of 5291]
 12288 of 12288   100% in    0s    74.50 kB/s  done
./app.js -> s3://epo-leaflet-test1/app.js  [2 of 5291]
 142 of 142   100% in    0s   983.44 B/s  done
./img/0/foo_0_0.jpg -> s3://epo-leaflet-test1/img/0/foo_0_0.jpg  [3 of 5291]
 20887 of 20887   100% in    0s    91.76 kB/s  done
...
```

Enable s3 website hosting
---

```shell
[master] ~/epo/maptest/leaflet-test $ s3cmd ws-create s3://epo-leaflet-test1
Bucket 's3://epo-leaflet-test1/': website configuration created.
[master] ~/epo/maptest/leaflet-test $ s3cmd ws-info s3://epo-leaflet-test1
Bucket s3://epo-leaflet-test1/: Website configuration
Website endpoint: http://epo-leaflet-test1.s3-website-us-east-1.amazonaws.com/
Index document:   index.html
Error document:   None
```

Behold s3 hosted demo
---

http://epo-leaflet-test1.s3-website-us-east-1.amazonaws.com/
