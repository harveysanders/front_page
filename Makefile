SASSC = sass --scss
SASSHOME = scss/
CSSHOME = www/css/

watch:
	$(SASSC) --quiet --watch $(SASSHOME):$(CSSHOME) > /dev/null 2>&1 &

build:
	$(SASSC) --trace --stop-on-error --update $(SASSHOME):$(CSSHOME)

