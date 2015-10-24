SASSC = sass --scss
SASSHOME = scss/
CSSHOME = www/css/

watch:
	$(SASSC) --sourcemap=none --quiet --watch $(SASSHOME):$(CSSHOME) > /dev/null 2>&1 &

build:
	$(SASSC) --sourcemap=none --trace --stop-on-error --update $(SASSHOME):$(CSSHOME)

