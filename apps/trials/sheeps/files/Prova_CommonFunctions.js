// Assumo che L e N siano o scalari o Array della stessa lunghezza se no usa solo i primi elementi degli array
function CombConv(L,N,t) {
	if (Array.isArray(L)) {
		var temp=[];
		for (var i=0;i<Math.min(L.length,N.length);i++) {
			temp.push(L[i]*(1-t)+t*N[i]);
		}
		return temp;
	}
	else {
		return L*(1-t)+t*N;
	}
}

function drawImageRotSc(ctx, img, x, y, angle = 0, scale = 1){
  ctx.save();
  ctx.translate(x + img.width * scale / 2, y + img.height * scale / 2);
  ctx.rotate(angle);
  ctx.translate(- x - img.width * scale / 2, - y - img.height * scale / 2);
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------
// Funzioni matematiche
// ------------------------------------------------------------------------------------------------

// Arrotonda un numero o ogni elemento di un array
function Arrotonda(L,n) {
	if (Array.isArray(L)) {
		return L.map(x => Math.round(x*Math.pow(10,n))/Math.pow(10,n));
	}
	else {
		return Math.round(L*Math.pow(10,n))/Math.pow(10,n);
	}
}

// Vero modulo!
function mod(x,n) {
	return ((x % n)+n) % n;	
}

// Intero random tra Imin e Imax (inclusi!)
function RandInt(Imin, Imax) {
  return Imin+Math.floor(Math.random()*(Imax+1-Imin));
}


// Controlla se il vettore V ha norma minore di ep.
function IsSmallEnough(V,ep) {
	if (ScalarPr(V,V)<ep*ep) {
		return true;
	}
	return false;
}


// Calcola il prodotto scalare tra V e W
function ScalarPr(V,W) {
	return (V[0]*W[0]+V[1]*W[1]);
}

// Restituisce a*V+b*W
function LinComb(V,W,a=1,b=1) {
	return [a*V[0]+b*W[0],a*V[1]+b*W[1]];
}

// Calcola la norma di V-W
function NormDiff(V,W) {
	return Math.sqrt((V[0]-W[0])*(V[0]-W[0])+(V[1]-W[1])*(V[1]-W[1]));
}

// Restituisce l'angolo tra V e W. Forse con segno.
function Ang(V,W) {
	return Math.acos(ScalarPr(V,W)/Math.sqrt(ScalarPr(V,V)*ScalarPr(W,W)))*180/Math.PI;
}

// Restituisce l'angolo tra PQ e PR. Forse con segno. Se uno dei due e' troppo piccolo, restituisce 0.
function AngPQR(P,Q,R) {
	if ((IsSmallEnough([Q[0]-P[0],Q[1]-P[1]],Soglia0)) || 
		(IsSmallEnough([R[0]-P[0],R[1]-P[1]],Soglia0))) {
		return 0;
	}
	return Ang([Q[0]-P[0],Q[1]-P[1]],[R[0]-P[0],R[1]-P[1]]);
}


function VNormalize(V,a) {
	var temp = Math.sqrt(ScalarPr(V,V));
	if (temp < 0.0001) {
		return [0,0,0];
	}
	else {
		return [a*V[0]/temp,a*V[1]/temp];
	}
}

// Ruota il punto P\in R^2 attorno a C di un angolo theta (in senso antiorario).
function Ruota(P,C,th) {
	return [C[0]+(P[0]-C[0])*Math.cos(th)+(P[1]-C[1])*Math.sin(th),C[1]-(P[0]-C[0])*Math.sin(th)+(P[1]-C[1])*Math.cos(th)];
}

// Restituisce il determinante della matrice [V,W]
function Det(V,W) {
	return V[0]*W[1]-V[1]*W[0];
}

// Dati 4 punti, considero le rette r ed s, passanti rispettivamente per a,b e c,d.
// Se le rette sono ben definite e non parallele restituisco r cap s (se no restituisco [0,0]).
function Intersection(a,b,c,d) {
	let det=Det(LinComb(b,a,1,-1),LinComb(d,c,1,-1));
	if (det==0) {
		return [0,0];
	}
	else {
		let det0=Det(LinComb(a,c,1,-1),LinComb(d,c,1,-1));
		return [a[0]-det0*(b[0]-a[0])/det,a[1]-det0*(b[1]-a[1])/det];
	}
}


// ------------------------------------------------------------------------------------------------
// Funzioni per l'animazione
// ------------------------------------------------------------------------------------------------

function PartenzaAnimazione() {
	window.fps=25;
	window.Interval = 1000/fps;
	StartStop();
	AnimON = ! AnimON;	
}

function StartStop() {
	/* Questa funzione e' quella da richiamare per far partire, oppure fermare, l'animazione */
	/* TODO: Vedere se si riesce a controllare direttamente da qui l'eventuale pulsante StartStop */
	if (!AnimStart) {
		HeadAnimazione();
		AnimStart=!AnimStart;
	} else {
		window.cancelAnimationFrame(IdAnimazione);
		IdAnimazione=undefined;
		AnimStart=!AnimStart;
	}
}

function AStart() {
	/*Fa partire e se è avviato non fa niente*/	
	if (AnimStart==false) StartStop();
}


function AStop() {
	/*Blocca e se è fermo non fa niente*/
	if (AnimStart==true) StartStop();
}

function HeadAnimazione() {
	/* Questa funzione contiene l'intestazione dell'animazione, in modo da non copiare in tutte le pagine le funzioni relative ai frame al secondo */
	/* TODO: nel caso ci siano pagine senza animazioni, mettere un controllo del tipo 'ifdef animazione then Animazione'*/
	/* Ricordarsi che, nel caso in una pagina ci siano piu di un requestanimationframe, questa cosa potrebbe dare fastidio*/
	
	window.IdAnimazione=window.requestAnimationFrame(HeadAnimazione); //Animazione
	Now = Date.now();
    Delta = Now - Then;
    if (Delta > Interval) {	
		Animazione(); //TODO: qui mettere il controllo ifdef
		Then = Now - (Delta % Interval);
	}
}
