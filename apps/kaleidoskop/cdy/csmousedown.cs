li=[hot1,hot2,hot3];
got=sort(1..3,|mouse().xy,li_#|)_1;
if(|mouse().xy,li_got|<4,type=got);

got=sort(1..length(images),|images_#_1,mouse().xy|)_1;
if(|mouse().xy,images_got_1|<4,sel=got);