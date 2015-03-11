TEMPFILE := $(shell mktemp -u)

all: leaflet-test.png

%.png : %.dot
	unflatten $< -o ${TEMPFILE} -l 10 -c 10
	dot -Tpng ${TEMPFILE} -o $@
	rm ${TEMPFILE}

clean:
	rm *.png
