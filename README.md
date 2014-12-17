Deploying to s3
====

Install the [s3cmd][1] utility
---

    yum install -y s3cmd

or

    yum install -y http://s3tools.org/repo/RHEL_6/x86_64/s3cmd-1.0.0-4.1.x86_64.rpm

Configure s3cmd
---

    s3cmd --configure

See the [s3cmd-howto][2] for details

Push to s3
---

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

See Also
---

* [1](http://s3tools.org/s3cmd)
* [2](http://s3tools.org/s3cmd-howto)
