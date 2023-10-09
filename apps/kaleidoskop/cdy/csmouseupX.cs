if(|mouse().xy,hot1|<3,type=1);
if(|mouse().xy,hot2|<3,type=2);
if(|mouse().xy,hot3|<3,type=3);

forall(1..length(images),
  p=images_#_1;
  if(|p,mouse().xy|<1.6,sel=#)
);