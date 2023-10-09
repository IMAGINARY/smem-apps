print("Init script");

type=1;

sel=1;

images=[
[(28,-4),"bild",.4],
[(28,-8),"bild2",.7],
[(28,-12),"bild3",.5],
[(28,-16),"bild4",.5]
];

pause():=(
   stopanimation();
);


resume():=(
   if(pendanimation,playanimation());
);

reset():=(

A.homog=(4, 0.63313657, -1.04065347);
B.homog=(0.9043478, -4, 0.6749865);
D.homog=(-3.2947, -4, 0.289674);
E.homog=(4, -1.4651206, 0.23502179);
G.homog=(4, -1.81823465, -0.2468792697);
M.homog=(4, 0, 0.13995);
L.homog=(4, -2.09576888, 0.181818);
pendanimation=true;

type=1;
sel=1;
);
pendanimation=true;
playanimation();


/* Initial values */
list = [];

/* Helper functions */

// Clamp a point p within a rectangle with mi as lower left corner, and ma as upper right corner.
restrict(p,mi,ma):=(
  xx=max(min(p.x,ma.x),mi.x);
  yy=max(min(p.y,ma.y),mi.y);
  p.xy=(xx,yy);
);


// Buttons
// Grausamer Copy Code, aber ich bin gerade Faul
createButtonType1(p):=(
 al=if(type!=1,.3,1);
 aa=complex(p);
 bb=complex(p+(-4,0));
 cc=bb-(bb-aa)*exp(60°*i)*.5;
 fillpolygon((gauss(aa),gauss(bb),gauss(cc)),color->(0.4,0.6,1)*al);
 draw(gauss(aa),gauss(bb),size->4,color->(1,1,1)*al);
 draw(gauss(aa),gauss(cc),size->4,color->(1,1,1)*al);
 draw(gauss(cc),gauss(bb),size->4,color->(1,1,1)*al);
 hot1=gauss((aa+bb)/2)+(0,2);
);

createButtonType2(p):=(
 al=if(type!=2,.3,1);
 aa=complex(p);
 bb=complex(p+(-4,0));
 cc=bb-(bb-aa)*exp(60°*i);
 fillpolygon((gauss(aa),gauss(bb),gauss(cc)),color->(0.4,0.6,1)*al);
 draw(gauss(aa),gauss(bb),size->4,color->(1,1,1)*al);
 draw(gauss(aa),gauss(cc),size->4,color->(1,1,1)*al);
 draw(gauss(cc),gauss(bb),size->4,color->(1,1,1)*al);
 hot2=gauss((aa+bb)/2)+(0,2);
);

createButtonType3(p):=(
 al=if(type!=3,.3,1);
 aa=complex(p);
 bb=complex(p+(-4,0));
 cc=bb-(bb-aa)*exp(45°*i)*sqrt(0.5);
 fillpolygon((gauss(aa),gauss(bb),gauss(cc)),color->(0.4,0.6,1)*al);
 draw(gauss(aa),gauss(bb),size->4,color->(1,1,1)*al);
 draw(gauss(aa),gauss(cc),size->4,color->(1,1,1)*al);
 draw(gauss(cc),gauss(bb),size->4,color->(1,1,1)*al);
 hot3=gauss((aa+bb)/2)+(0,2);
);



// Ramp up function
// Line with a slope slightly > 1, clamped between 0 and 1. 
// The diagnal line has its centerpoint at (x,r)=(a+1/2, 1/2)

d=0.1;
dd=(1/(1-2*d));
r(x,a):=max(0,min(1,(x-a-0.5)*dd+0.5));
// plot(r(x,2));


// Compute the transformations list
id=((1,0,0),(0,1,0),(0,0,1));

computeMatrices():=(

l=|K,L|/|K,H|-0.00001; // Main slider


if(type==1,
 tilesPerGeneration=12;

 list=(
  id,
  t1,
  t2,
  t1*t2,
  t1*t2*t1,
  t1*t2*t1*t2,
  t1*t2*t1*t2*t1,
  t1*t2*t1*t2*t1*t2,
  t1*t2*t1*t2*t1*t2*t1,
  t1*t2*t1*t2*t1*t2*t1*t2,
  t1*t2*t1*t2*t1*t2*t1*t2*t1,
  t1*t2*t1*t2*t1*t2*t1*t2*t1*t2);

  numberOfGenerations = 12;
  n = l * numberOfGenerations + 1; 

  list=list
         ++apply(list,#*(-r(n,2)*t3+(1-r(n,2))*id))
         ++apply(list,#*t3*(-r(n,3)*t2+(1-r(n,3))*id))
         ++apply(list,#*t3*t2*(-r(n,4)*t1+(1-r(n,4))*id))
         ++apply(list,#*t3*t2*t1*(-r(n,5)*t2+(1-r(n,5))*id))
         ++apply(list,#*t3*t2*t1*t2*(-r(n,6)*t1+(1-r(n,6))*id))
         ++apply(list,#*t3*t2*t1*t2*t1*(-r(n,7)*t2+(1-r(n,7))*id))
         ++apply(list,#*t3*t2*t1*t2*t1*t2*(-r(n,8)*t3+(1-r(n,8))*id))
         ++apply(list,#*t3*t2*t1*t2*t1*t2*t3*(-r(n,9)*t2+(1-r(n,9))*id))
         ++apply(list,#*t3*t2*t1*t2*(-r(n,10)*t3+(1-r(n,10))*id))
         ++apply(list,#*t3*t2*t1*t2*t3*(-r(n,11)*t1+(1-r(n,11))*id))
         ++apply(list,#*t3*t2*t1*t2*t3*t1*(-r(n,12)*t2+(1-r(n,12))*id));
);


if(type==2,
 tilesPerGeneration = 6;

 list=(
  id,
  t1,
  t2,
  t1*t2,
  t1*t2*t1,
  t1*t2*t1*t2);

  numberOfGenerations = 12;
  n = l * numberOfGenerations + 1; 

  list=list
         ++apply(list,#*(-r(n,2)*t3+(1-r(n,2))*id))
         ++apply(list,#*t3*(-r(n,3)*t1+(1-r(n,3))*id))
         ++apply(list,#*t3*(-r(n,4)*t2+(1-r(n,4))*id))
         ++apply(list,#*t3*t1*(-r(n,5)*t2+(1-r(n,5))*id))
         ++apply(list,#*t3*t2*(-r(n,6)*t1+(1-r(n,6))*id))
         ++apply(list,#*t3*t2*t1*(-r(n,7)*t2+(1-r(n,7))*id))
         ++apply(list,#*t3*t2*t1*(-r(n,8)*t3+(1-r(n,8))*id))
         ++apply(list,#*t3*t2*t1*t3*(-r(n,9)*t2+(1-r(n,9))*id))
         ++apply(list,#*t3*t2*t1*t2*(-r(n,10)*t3+(1-r(n,10))*id))
         ++apply(list,#*t3*t2*t1*t3*t2*(-r(n,11)*t3+(1-r(n,11))*id))
         ++apply(list,#*t3*t1*t2*(-r(n,12)*t3+(1-r(n,12))*id))
);


if(type==3,
 tilesPerGeneration = 8;

 list=(
  id,
  t1,
  t2,
  t1*t2,
  t1*t2*t1,
  t1*t2*t1*t2,
  t1*t2*t1*t2*t1,
  t1*t2*t1*t2*t1*t2);

  numberOfGenerations = 12;
  n = l * numberOfGenerations + 1; 

  list=list
         ++apply(list,#*(-r(n,2)*t3+(1-r(n,2))*id))
         ++apply(list,#*t3*(-r(n,3)*t2+(1-r(n,3))*id))
         ++apply(list,#*t3*t2*(-r(n,4)*t1+(1-r(n,4))*id))
         ++apply(list,#*t3*t2*(-r(n,5)*t3+(1-r(n,5))*id))
         ++apply(list,#*t3*t2*t1*(-r(n,6)*t2+(1-r(n,6))*id))
         ++apply(list,#*t3*t2*t3*(-r(n,7)*t1+(1-r(n,7))*id))
         ++apply(list,#*t3*t2*t3*t1*(-r(n,8)*t2+(1-r(n,8))*id))
         ++apply(list,#*t3*t2*t3*t1*t2*(-r(n,9)*t1+(1-r(n,9))*id))
         ++apply(list,#*t3*t2*t1*t2*(-r(n,10)*t3+(1-r(n,10))*id))
         ++apply(list,#*t3*t2*t1*t3*t2*(-r(n,11)*t3+(1-r(n,11))*id))
         ++apply(list,#*t3*t2*t1*t3*t2*t3*(-r(n,12)*t1+(1-r(n,12))*id))
);

numTiles = tilesPerGeneration * floor(n); // how many tiles to draw
list=apply(1..numTiles,list_#); // cut the list

);


// Draw a tile
f(p,m):=m*p.homog;

drawme2(m,al):=(
 gsave();
// fill(polygon((f(A,m),f(B,m),f(F,m))),color->(0,0,0)); // No need to clear the area.
 clip((f(a,m),f(b,m),f(c,m)));
 drawimage(f(D,m),f(E,m),f(G,m),bild,alpha->al);
 grestore();
 draw(f(a,m),f(b,m),size->3,color->(0,0,0),alpha->al);
 draw(f(b,m),f(c,m),size->3,color->(0,0,0),alpha->al);
 draw(f(a,m),f(c,m),size->3,color->(0,0,0),alpha->al);
);
