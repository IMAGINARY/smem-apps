async function setup()
{
	LenghtArray=6;
	MatrixGame=GetNewMatrix(LenghtArray);
	
	//This is a very dangerous way to get an invertible matrix
	while(determinant(MatrixGame) % 2 == 0) Randomize(MatrixGame);
	
	LightVector=GetNewVector(LenghtArray);
	ButtonVector=GetNewVector(LenghtArray);
	
	//A little help for me by putting in the console the "solution"
	console.log(math.transpose(math.lusolve(MatrixGame, new Array(LenghtArray).fill(1))));
	
	
	for (i=0;i<LenghtArray;i++) {
		document.getElementById("light-wrapper").appendChild(await CreateImage(i,"lamp","L","imglamps"));
		document.getElementById("button-wrapper").appendChild(await CreateImage(i,"","B","imgbuttons",ChangeStatus));
	}
	
	audio=new Array(LenghtArray);
	
	SampleSelector=Math.floor(Math.random()*4);
	
	for (i=0;i<LenghtArray;i++) {
		audio[i]=await LoadAudio("./files/"+SampleSelector+"_"+ i +".mp3");
		
	}



  
}

async function LoadAudio(Src) {
	return new Promise((resolve, reject) => {
		NewAudio=document.createElement("AUDIO");
		NewAudio.oncanplaythrough = () => resolve(NewAudio);
		NewAudio.src=Src;
	});
}


async function CreateImage(N,Src, PreId, Class, Funct) {
	return new Promise((resolve, reject) => {
		NewButton=document.createElement("img");
		NewButton.src = "files/"+Src+"off.png";
		NewButton.name=Src;
		NewButton.id= PreId + N;
		NewButton.classList.add(Class); 
		NewButton.onload = () => resolve(NewButton)
		
		if (Funct  !== undefined){
			NewButton.addEventListener('mousedown',Funct);
		}
	});
}



window.addEventListener( 'load', setup );


const determinant = m => 
  m.length == 1 ?
  m[0][0] :
  m.length == 2 ? 
  m[0][0]*m[1][1]-m[0][1]*m[1][0] :
  m[0].reduce((r,e,i) => 
    r+(-1)**(i+2)*e*determinant(m.slice(1).map(c => 
      c.filter((_,j) => i != j))),0)

function GetNewMatrix(Len) {
	return Array.from(Array(Len), () => new Array(Len).fill(0))
}

function GetNewVector(Len) {
	return new Array(Len).fill(0)
}

function Randomize(Matrix) {	
	for(var i=0; i<Matrix.length; i++){
		for(var j=0; j<Matrix[i].length; j++){
			Matrix[i][j]=Math.floor(Math.random()*2);
		}
	}
}

function ChangeStatus() {
	n=Number(this.id.slice(1));
	for (var i=0;i<LenghtArray;i++) {
		if (MatrixGame[i][n]==1) {
			LightVector[i]=1-LightVector[i];
			ThisName=document.getElementById("L"+i).name;
			document.getElementById("L"+i).src=((LightVector[i]==0) ? "files/"+ThisName+"off.png" : "files/"+ThisName+"on.png");
			if (LightVector[i]==1) {
				audio[i].currentTime = 0
				audio[i].play();
				
			} else {
				audio[i].pause();
				audio[i].currentTime = 0
			}
		}
	}
	ButtonVector[n]=1-ButtonVector[n];
	document.getElementById("B"+n).src=((ButtonVector[n]==0) ? "files/off.png" : "files/on.png");


}



