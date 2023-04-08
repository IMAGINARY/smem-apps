// ------------------------------------------------------------------------------------------------
// Classe GRAFO
// ------------------------------------------------------------------------------------------------

// Funzione "tipo mollificatore": pari, con supporto tra -a e a (a>0), vale 1 in 0, e' strettamente decrescente in (0,a).
function Moll(x,a=1) {
	if (a<=0) {
		return (x==0 ? 1 :0);
	}
	else {
		return (Math.abs(x)<a ? Math.exp(x*x/(a*a*(x*x-a*a)) ): 0);
	}
}


// Implemento la classe Vec2, che rappresenta un vettore 2D. La uso anche per rappresentare un punto P sul piano,
// identificandolo con il vettore OP.

class Vec2 {
	constructor(xvec=0,yvec=0) {
		this.x=xvec;
		this.y=yvec;
	}

	// Calcola il prodotto scalare tra questo oggetto e un vettore Vec2 assegnato.
	ScalarPr(vec = new Vec2(0,0)) {
		return (this.x)*(vec.x)+(this.y)*(vec.y);
	}

	Rescale(a=1) {
		return new Vec2(a*(this.x),a*(this.y));
	}
	
	Sum(vec = new Vec2(0,0)) {
		return new Vec2((this.x)+(vec.x),(this.y)+(vec.y));
	}
	
	Diff(vec = new Vec2(0,0)) {
		return new Vec2((this.x)-(vec.x),(this.y)-(vec.y));
	}
	
	Rand(t=1) {
		return new Vec2(this.x+t*(Math.random()-0.5),this.y+t*(Math.random()-0.5))
		
	}
	
	AddValue(A,B) {
		return new Vec2((this.x)+A,(this.y)+B);		
	}

	// Restituisce a*V+b*W
	LinComb(vec = new Vec2(0,0),a=1,b=1) {
		return new Vec2(a*this.x+b*vec.x,a*this.y+b*vec.y);
	}
	
	// Restituisce la norma del vettore
	Norm() {
		return Math.sqrt(this.ScalarPr(this));
	}

	// Controlla se il vettore ha norma minore o uguale a toll
	IsZero(toll=0.00001) {
		if (this.Norm()<=toll*toll) {
			return true;
		}
		else {
			return false;
		}
	}

	// Normalizza il vettore (eventualmente anche applicando un fattore di riscalamento)
	Normalize(a=1) {
		if (this.IsZero()) {
			return this;
		}
		else {
			return this.Rescale(a/this.Norm());
		}
	}
	
	// Restituisce l'angolo in radianti (o in gradi) tra questo oggetto e il vettore assegnato. 
	Angle(vec,Rad=true) {
		if (this.IsZero() || vec.IsZero()) {
			return 0;
		}
		if (Rad) {
			return Math.acos(this.ScalarPr(vec)/(this.Norm()*vec.Norm()));
		}
		else {
			return Math.acos(this.ScalarPr(vec)/(this.Norm()*vec.Norm()))*180/Math.PI;
		}
	}
	
	// In questo metodo Vert, Estr1 e Estr2 sono intesi come punti del piano.
	// Restituisce l'angolo al vertice Vert, identificato dalle semirette per Estr1 e Estr2. 
	// Se due punti coincidono restituisce 0.
	AnglePts(Vert,Estr1,Estr2) {
		return (Estr1.Diff(Vert)).Angle(Estr2.Diff(Vert));
	}
	
	// Restituisce la distanza euclidea di this (inteso come punto) da Q (inteso come punto)
	Dist(Q) {
		return (this.Diff(Q)).Norm();
	}
	
	// Trasla il punto P del vettore V.
	Trasla(V) {
		return P.Sum(V);
	}
	
	// In questo metodo P e C sono intesi come punti del piano.
	// Ruota il punto P attorno a C di un angolo theta (in senso antiorario).
	Ruota(P,C,th=0) {
		return new Vec2(C.x+(P.x-C.x)*Math.cos(th)+(P.y-C.y)*Math.sin(th),C.y-(P.x-C.x)*Math.sin(th)+(P.y-C.y)*Math.cos(th));
	}

	// Restituisce il punto medio di this e Q
	Mean(Q) {
		return new Vec2((this.x+Q.x)/2,(this.y+Q.y)/2);
	}
		
}

// Implemento la classe GRAPH, che dovrebbe gestire grafi (non multigrafi!) - per ora - semplici (niente self-loop)
// non orientati, con pesi - eventuali - su vertici e lati. Per come e' strutturato, potrebbe gestire anche pesi
// negativi o nulli sui lati, ma non so come si comportano gli algoritmi implementati (Prim, per ora)

// Un oggetto VERTEX. Caratterizzato da posizione ([x,y]), nel caso serva disegnarlo, 
// dal peso del vertice (weight) e dall'array dei vertici collegati a lui con un lato.

// EXTRA: this.type specifica una tipologia per il vertice (da specificare in base alla necessita')
// type=0: Vertice normale.
// type=1: Morte 
// type=2: Fattoria
// type>=3: ?? (Aumenta/Diminuisce la velocita'?)

class Vertex {
	constructor(vec= new Vec2(0,0),weight=1,type=0) {
		this.pos=vec;
		this.weight=weight;
		this.type=type;
	}
}

// Un oggetto GRAPH. Caratterizzato dall'array dei vertici (Vertices),
// dalla matrice di adiacenza (adjMat) e dalla matrice dei pesi dei lati (weightMat).
// adjMat e' una matrice quadrata che alla posizione (i,j) ha 0 o 1 a seconda che i corrispondenti vertici siano connessi.
// weightMat e' una matrice quadrata che alla posizione (i,j) ha il peso (supporta anche pesi negativi o nulli)
// del lato tra i vertici alla posizione i e j.
// this. MST e' un minimal spanning tree (se calcolato)
class Graph {
	constructor() {
		this.Vertices = [];
		this.adjMat=[[]];
		this.weightMat=[[]];
		this.MST=[];
	}
	
	// Metodi della classe GRAPH.
	
	// Restituisce il numero di vertici del grafo.
	NVert() {
		return this.Vertices.length;
	}
	
	// Aggiunge un oggetto VERTEX all'array dei vertici (e modifica la dimensione della matrice di adiacenza)
	AddVertex(x=0,y=0,weight=1,type=true) {
		if (this.NVert()==0) {
			this.adjMat=[[0]];
			this.weightMat=[[1]];
		}
		else {
			let Vtemp=[];
			for (var i=0;i<this.NVert();i++) {
				this.adjMat[i].push(0); // Il nuovo vertice e' inizializzato scollegato a tutti i vertici
				this.weightMat[i].push(1); // I nuovi potenziali lati sono inizializzati con peso 1
				Vtemp.push(0);
			}
			Vtemp.push(0);
			this.adjMat.push(Vtemp);
			this.weightMat.push(Vtemp.map(x => x+1));
		}
		
		this.Vertices.push(new Vertex(new Vec2(x,y),weight,type));
	}
	
	RemoveVertex(j) {
		if ((j>=0) && (j<this.NVert())) {
			this.Vertices.splice(j,1); // Tolgo il j-esimo vertice
			this.adjMat.splice(j,1); // Tolgo la j-esima riga
			this.weightMat.splice(j,1); // Tolgo la j-esima riga
			for (var i=0;i<this.NVert();i++) {
				this.adjMat[i].splice(j,1); // Tolgo il j-esimo elemento dalla riga i
				this.weightMat[i].splice(j,1); // Tolgo il j-esimo elemento dalla riga i
			}
		}
		else {
			console.log("Stai cercando di rimuovere un vertice che non esiste...");
		}
	}

	// Rende il grafo completo
	SetCompleteGraph() {
		for (var i=0; i<G.NVert();i++) {
			for (var j=0; j<G.NVert();j++) {
				this.adjMat[i][j]=((i==j) ? 0 : 1);
			}
		}	
	}
	
	// Setta le distanze euclidee
	SetEuclideanDistances() {
		for (var i=0; i<G.NVert();i++) {
			for (var j=0; j<G.NVert();j++) {
				if (this.adjMat[i][j]==1) {
					this.weightMat[i][j]=(this.Vertices[i].pos).Dist(this.Vertices[j].pos);
				}
			}
		}	
	}
	

	// Utility per forzare la simmetria delle matrici di adiacenza e dei pesi.
	// Di fatto copia il valoro adjMat[i][j] con i<j in adjMat[j][i] (idem per weightMat)
	Simmetrizza() {
		for (var j=0; j<G.NVert();j++) {
			for (var i=0; i<j;i++) {
				this.adjMat[j][i]=this.adjMat[i][j];
				this.weightMat[j][i]=this.weightMat[i][j];
			}
		}	
	}



	// Esegue l'algoritmo di Prim (ricerca di un albero minimale)
	// PROBABILMENTE da' problemi se il grafo non e' connesso.
	PrimAlgorithm(j=0) {
		this.MST=[];
		if (this.NVert()!=0) {
			var edges = [];
			var visited = [];
			var minEdge = [null,null,Infinity];

			// arbitrarily choose initial vertex from graph
			var vertex = j;
			
			// run prims algorithm until we create an MST
			// that contains every vertex from the graph
			while (this.MST.length !== this.NVert()-1) {
				
				// mark this vertex as visited
				visited.push(vertex);
				
				// add each edge to list of potential edges
				for (var r = 0; r < this.NVert(); r++) {
				  if (this.adjMat[vertex][r] !== 0) { 
					edges.push([vertex,r,this.weightMat[vertex][r]]); 
				  }
				}

				// find edge with the smallest weight to a vertex
				// that has not yet been visited
				for (var e = 0; e < edges.length; e++) {
				  if ((edges[e][2] < minEdge[2]) && (visited.indexOf(edges[e][1]) === -1)) { 
					minEdge = edges[e]; 
				  }
				}

				// remove min weight edge from list of edges
				edges.splice(edges.indexOf(minEdge), 1);

				// push min edge to MST
				this.MST.push(minEdge);
				  
				// start at new vertex and reset min edge
				vertex = minEdge[1];
				minEdge = [null,null,Infinity];
			}
		}
	}
	
	// Restituisce la lunghezza del MST in memoria (o di quello che this.MST) e' al momento.
	LengthMST() {
		var temp=0;
		for (var i=0;i<this.MST.length;i++) {
			temp+=this.MST[i][2];
		}
		return temp;
	}	
	
	PlotGraph(ctx) {
		ctx.clearRect(-w,-h,3*w,3*h);

		// Vertici
		for (var i=0;i<this.NVert();i++) {
			switch(this.Vertices[i].type) {
				case 0: 
					ctx.fillStyle="rgb(0,0,255)";		
					ctx.beginPath();
					ctx.arc(this.Vertices[i].pos.x,
							this.Vertices[i].pos.y,8,0,2*Math.PI,true);
					ctx.closePath();
					ctx.fill();							
				break;
				
				case 1:
					ctx.fillStyle="rgb(0,0,0)";		
					ctx.fillRect(
							this.Vertices[i].pos.x-15,
							this.Vertices[i].pos.y-15,30,30);
				break;
				
				case 2:
					ctx.fillStyle="rgb(0,255,0)";		
					ctx.beginPath();
					ctx.arc(this.Vertices[i].pos.x,
							this.Vertices[i].pos.y,30,0,2*Math.PI,true);
					ctx.closePath();
					ctx.fill();							
				break;				
			}
		}


		ctx.strokeStyle="rgb(255,165,0)";
		ctx.lineWidth=1;

		// Lati
		
		ctx.beginPath();
		for (var j=0; j<this.NVert();j++) {
			for (var i=0; i<j;i++) {
				if (this.adjMat[i][j]!=0) {
					ctx.moveTo(this.Vertices[i].pos.x,this.Vertices[i].pos.y);
					ctx.lineTo(this.Vertices[j].pos.x,this.Vertices[j].pos.y);
				}
			}
		}	
		ctx.stroke();
		
		
		// Plotto this.MST (se non ricavato non fa nulla)
		if (this.MST.length>0) {
			ctx.strokeStyle="rgb(100,100,100)";
			ctx.lineWidth=3;
			ctx.beginPath();
			for (var i=0; i<this.MST.length;i++) {
				ctx.moveTo(this.Vertices[this.MST[i][0]].pos.x,this.Vertices[this.MST[i][0]].pos.y);
				ctx.lineTo(this.Vertices[this.MST[i][1]].pos.x,this.Vertices[this.MST[i][1]].pos.y);
			}	
			ctx.stroke();
		}
				
	}
	
	
	
	
	PlotBranch(ctx,FF,TTT) {
		
		ctx.clearRect(-w,-h,3*w,3*h);

		// Lati
		
		for (var j=0; j<this.NVert();j++) {
			for (var i=0; i<j;i++) {
				if (this.adjMat[i][j]!=0) {
					Dati=EdgeData[i.toString()+"-"+j.toString()]
					this.DrawBranch(ctx,this.Vertices[i].pos,this.Vertices[j].pos,Dati);
				}
			}
		}	
	
		// Vertici
		for (var i=0;i<this.NVert();i++) {
			Immagine=FF[(i*i*i)%5];
			this.drawRotated(Immagine, ctx, 0, this.Vertices[i].pos.x-30, this.Vertices[i].pos.y-30, 60, 60);
			/*
			switch(this.Vertices[i].type) {
				case 0: 
					ctx.fillStyle="rgb(0,0,255)";		
					ctx.beginPath();
					ctx.arc(this.Vertices[i].pos.x,
							this.Vertices[i].pos.y,8,0,2*Math.PI,true);
					ctx.closePath();
					ctx.fill();							
				break;
				
				case 1:
					ctx.fillStyle="rgb(0,0,0)";		
					ctx.fillRect(
							this.Vertices[i].pos.x-15,
							this.Vertices[i].pos.y-15,30,30);
				break;
				
				case 2:
					ctx.fillStyle="rgb(0,255,0)";		
					ctx.beginPath();
					ctx.arc(this.Vertices[i].pos.x,
							this.Vertices[i].pos.y,30,0,2*Math.PI,true);
					ctx.closePath();
					ctx.fill();							
				break;				
			}
			*/
		}


		
		
		
				
	}

Remap(TTT,A,B) {
	if (TTT<A) return 0;
	if (TTT>B) return 1;
	return (TTT-A)/(B-A);
}
	
drawRotated(image, context, angle, left, top, width, height) {
    context.save();
    context.translate(left + width / 2, top + height / 2);
    context.rotate(Math.PI / 180 * angle);
    context.drawImage(image, - width / 2, - height / 2, width, height);
    context.restore();
}
	
	LongCurve(ctx,Points,FirstControlPoint,SubBranches,TTT) {
		
		let CurrentControl=FirstControlPoint;
		for (let i=0;i<Points.length-1;i++) {
			let A=Points[i];
			let B=Points[i+1];
			/*ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.arc(CurrentControl.x, CurrentControl.y, 5, 0, 2 * Math.PI); // Control point one
			ctx.fill();
			ctx.fillStyle = "blue";
			ctx.beginPath();
			ctx.arc(A.x, A.y, 5, 0, 2 * Math.PI); // Control point one
			ctx.arc(B.x, B.y, 5, 0, 2 * Math.PI); // Control point one
			ctx.fill();
			*/
			
			let Valore=this.Remap(TTT,i/(Points.length+1),(i+1)/(Points.length+1));
			//console.log(Valore);
			drawBezierSplit(ctx, A.x, A.y, CurrentControl.x, CurrentControl.y,B.x, B.y, 0, Valore);
			
			if (SubBranches && Math.random()>0.8) {
				let PuntoInizio=PointOnBezier(A.x, A.y, CurrentControl.x, CurrentControl.y,B.x, B.y,0,Math.random()*0.5+0.25)
				let Direzione=A.Diff(B);
				
				this.DB(ctx,PuntoInizio,PuntoInizio.Sum(Direzione.Rand(10)),3,0.1,false);
				
			}
			
			
			CurrentControl.x=2*B.x-CurrentControl.x;
			CurrentControl.y=2*B.y-CurrentControl.y;
		}
	}
	
	DrawBranch(ctx,Inizio,Fine,Dati) {
	
		
		
		let Numero=Dati.NumeroBranch
		let Colors=Dati.Colors;
		let Suddivisioni=Dati.PanceSuddivisioni;
		let Lunghezze=Dati.SpessoreSuddivisioni;
		let SubB=Dati.SottoBranch;
		let TTT=Dati.TTT;
		for (let j=0;j<Numero;j++) {
			ctx.lineWidth = Lunghezze[j];
			ctx.strokeStyle = Colors[j];
			this.DB(ctx,Inizio,Fine,Suddivisioni[j],SubB[j],TTT,Dati.RandomSuddivisioni.slice(j*5),Dati.RandomControlPoint.slice(j*5));
		}
	}
	
	
	DB(ctx,Inizio,Fine,Subdivision,SubBranches,TTT,RandomSuddivisioni,RandomControlPoint) {
			let Points=[]
			let Direzione=Fine.Diff(Inizio)
			let Lunghezza=Direzione.Norm();
			for (let i=0;i<Subdivision;i++) {
				Points.push(Inizio.LinComb(Direzione,1,i/Subdivision).AddValue(RandomSuddivisioni[2*i]*Lunghezza/50,RandomSuddivisioni[2*i+1]*Lunghezza/50))
			}
			Points.push(Fine)
			
			
			let DirezioneNormale={x:Direzione.y/25, y:-Direzione.x/25}
			if (RandomControlPoint[2]>0) DirezioneNormale={x:-Direzione.y/25, y:Direzione.x/25}
			let FirstControlPoint=Inizio.LinComb(Direzione,1,1/(2*Subdivision)).Sum(DirezioneNormale).AddValue(RandomControlPoint[0]*Lunghezza/60,RandomControlPoint[1]*Lunghezza/60);
			this.LongCurve(ctx,Points,FirstControlPoint,SubBranches,TTT) 
	}
	
}

function lerp(v0, v1, t) {
    return ( 1.0 - t ) * v0 + t * v1;
}

function PointOnBezier(x0, y0, x1, y1, x2, y2, t0, t1) {
	var t00 = t0 * t0,
            t01 = 1.0 - t0,
            t02 = t01 * t01,
            t03 = 2.0 * t0 * t01;
        
	var nx0 = t02 * x0 + t03 * x1 + t00 * x2,
		ny0 = t02 * y0 + t03 * y1 + t00 * y2;
	
	t00 = t1 * t1;
	t01 = 1.0 - t1;
	t02 = t01 * t01;
	t03 = 2.0 * t1 * t01;
	
	var nx2 = t02 * x0 + t03 * x1 + t00 * x2,
		ny2 = t02 * y0 + t03 * y1 + t00 * y2;
	
	var nx1 = lerp ( lerp ( x0 , x1 , t0 ) , lerp ( x1 , x2 , t0 ) , t1 ),
		ny1 = lerp ( lerp ( y0 , y1 , t0 ) , lerp ( y1 , y2 , t0 ) , t1 );
	
	
	return new Vec2(nx2, ny2)
}

function drawBezierSplit(ctx, x0, y0, x1, y1, x2, y2, t0, t1) {
    ctx.beginPath();
    
	if( 0.0 == t0 && t1 == 1.0 ) {
		ctx.moveTo( x0, y0 );
		ctx.quadraticCurveTo( x1, y1, x2, y2 );
	} else if( t0 != t1 ) {
        var t00 = t0 * t0,
            t01 = 1.0 - t0,
            t02 = t01 * t01,
            t03 = 2.0 * t0 * t01;
        
        var nx0 = t02 * x0 + t03 * x1 + t00 * x2,
            ny0 = t02 * y0 + t03 * y1 + t00 * y2;
        
        t00 = t1 * t1;
        t01 = 1.0 - t1;
        t02 = t01 * t01;
        t03 = 2.0 * t1 * t01;
        
        var nx2 = t02 * x0 + t03 * x1 + t00 * x2,
            ny2 = t02 * y0 + t03 * y1 + t00 * y2;
        
        var nx1 = lerp ( lerp ( x0 , x1 , t0 ) , lerp ( x1 , x2 , t0 ) , t1 ),
            ny1 = lerp ( lerp ( y0 , y1 , t0 ) , lerp ( y1 , y2 , t0 ) , t1 );
        
        ctx.moveTo( nx0, ny0 );
        ctx.quadraticCurveTo( nx1, ny1, nx2, ny2 );
	}
    
    ctx.stroke();
    ctx.closePath();
}

