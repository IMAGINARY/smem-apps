speed=|C,M|/|C,F|;

ttt=0.5 * speed;
D.xy=gauss(complex(D)*exp(.03*i*ttt));
E.xy=gauss(complex(E)*exp(.03*i*ttt));
G.xy=gauss(complex(G)*exp(.03*i*ttt));