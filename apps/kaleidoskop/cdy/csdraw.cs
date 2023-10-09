

// Set rectangle for the viewport
minpt=(-22,-17);  // lower left corner
maxpt=(19,17);    // upper right corner

// draw(minpt,maxpt);
// draw(minpt);
// draw(maxpt);

// Make sure that points are within the viewport rectangle
restrict(A,minpt,maxpt);
restrict(B,minpt,maxpt);
restrict(G,minpt,maxpt);
restrict(D,minpt,maxpt);
restrict(E,minpt,maxpt);

oldA = A.xy;
oldB = B.xy;
oldL = L.xy;
oldType = type;
// print(oldA);

bild=images_sel_2;

if(M.x<=C.x,
    M.xy=C.xy);
if(M.x>=F.x,
    M.xy=F.xy);
if(L.y<=K.y,
    L.xy=K.xy);
if(L.y>=H.y,
    L.xy=H.xy);

alp=|C,M|/|C,F|/2;

// A: center of the kaleidoscope
// A, B: endpoints of the original side of the fundamental triangle

aa=complex(A);
bb=complex(B);

// (30,60,90)-angled triangle 
if(type==1,
 cc=bb-(bb-aa)*exp(60°*i)*.5;
);

// (60,60,60)-angled triangle 
if(type==2,
 cc=bb-(bb-aa)*exp(60°*i)*1;
);

// (45,45,90)-angled triangle 
if(type==3,
 cc=bb-(bb-aa)*exp(45°*i)*sqrt(.5);
);


a=gauss(aa);
b=gauss(bb);
c=gauss(cc);


t2=linereflect(join(gauss(aa),gauss(bb)));
t1=linereflect(join(gauss(aa),gauss(cc)));
t3=linereflect(join(gauss(cc),gauss(bb)));

t1=-t1/t1_3_3;
t2=-t2/t2_3_3;
t3=-t3/t3_3_3;

drawimage(D,E,G,bild,alpha->alp);

computeMatrices();
//computeMatrices is called only when A, B, L or type has changed.

// Draw all the tiles
 forall(1..length(list),
  drawme2(list_#,r(n,1));
 );


// Draw boundary of fundamental triangle
draw(gauss(aa),gauss(bb),size->4,color->(1,1,1));
draw(gauss(aa),gauss(cc),size->4,color->(1,1,1));
draw(gauss(cc),gauss(bb),size->4,color->(1,1,1));



// UI (menu buttons)

fi(d,a):=(
fill(
polygon(screenbounds())--polygon([
 [-24-d,-21-d],
 [19+d,-21-d],
 [19+d,20+d],
 [-24-d,20+d]
]
),
//COLOR
// color->(2/255,47/255,83/255),
color->(0,0,0),
alpha->a);
);

fi(0,0.2);
fi(0.1,0.2);
fi(0.2,0.2);
fi(0.3,0.2);
fi(0.4,0.2);
fi(0.5,0.2);
fi(0.6,0.2);
fi(0.7,1);

fillpolygon((
  (20,-100),
  (20,100),
  (120,100),
  (120,-100)
),
//COLOR
//color->(2/255,47/255,83/255)
color->(0,0,0)
);

createButtonType2((30,12));
createButtonType3((30,7));
createButtonType1((30,2));

apply(1..4,ind=images_#;
  drawimage(ind_1,ind_2,scale->2.625*ind_3*.3,alpha->if(sel==#,1,0.45))
);

