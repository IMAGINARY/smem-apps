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
// type=3: Strada bloccata
// type>=4: ?? (Aumenta/Diminuisce la velocita'?)

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
// this.MST e' un minimal spanning tree (se calcolato)
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
	
	// Funzione per disegnare un'immagine in un context
	drawRotated(image, context, angle, left, top, width, height) {
		context.save();
		context.translate(left + width / 2, top + height / 2);
		context.rotate(Math.PI / 180 * angle);
		context.drawImage(image, - width / 2, - height / 2, width, height);
		context.restore();
	}
	
	PlotGraph(ctx,Mirt,Salad,Hut,IMAG) {
		ctx.clearRect(-w,-h,3*w,3*h);
		
		
		
		// Vertici
		for (var i=0;i<this.NVert();i++) {
			if (this.Vertices[i].pos.x>0) {
			switch(this.Vertices[i].type) {
				case 0: 
					ctx.fillStyle="#3b972d";		
					ctx.fillStyle="#2d6697";		
					ctx.beginPath();
					ctx.arc(this.Vertices[i].pos.x,
							this.Vertices[i].pos.y,27,0,2*Math.PI,true);
					ctx.closePath();
					ctx.fill();		

					
				break;	
			}
			}
		}


		ctx.strokeStyle="#3b972d";
		ctx.strokeStyle="#2d6697";
		ctx.lineWidth=35;

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
		
		ctx.strokeStyle="#82e27e";
		ctx.strokeStyle="#89dde2";
		ctx.lineWidth=25;
		
		
		for (var i=0;i<this.NVert();i++) {
			switch(this.Vertices[i].type) {
				case 0: 
					ctx.fillStyle="#82e27e";		
					ctx.fillStyle="#89dde2";		
					ctx.beginPath();
					ctx.arc(this.Vertices[i].pos.x,
							this.Vertices[i].pos.y,22,0,2*Math.PI,true);
					ctx.closePath();
					ctx.fill();							
				break;	
			}
		}

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
		
		
		
		
		
		for (var i=0;i<this.NVert();i++) {
			switch(this.Vertices[i].type) {
				
				
				case 1:
					if (i%2==0) drawRotated(Mirt, ctx, 0, this.Vertices[i].pos.x-40, this.Vertices[i].pos.y-40, 80, 80)
					else drawRotated(Salad, ctx, 0, this.Vertices[i].pos.x-40, this.Vertices[i].pos.y-40, 80, 80)
				break;
				
				case 2:
					drawRotated(Hut, ctx, 0, this.Vertices[i].pos.x-50, this.Vertices[i].pos.y-50, 100, 100)
				break;

				case 3:
					drawRotated(IMAG, ctx, 0, this.Vertices[i].pos.x-30, this.Vertices[i].pos.y-30, 60, 60)
				break;
							
			}
		}
		
		
				
	}
	
}

