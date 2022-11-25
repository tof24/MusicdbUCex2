var search=0;
var list = [];
const searchInput= document.getElementById("searchh");
var bio="rainbow";

searchInput.addEventListener("input",e =>{
    const value = e.target.value;
    bio=value;
})


const getSimilar = async () => {

    const response = await fetch('http://ws.audioscrobbler.com/2.0/?method=album.search&album='+bio+'&api_key=acb24ec5f7bd68800c7bee59bdfac898&format=json&limit=14');

    //const response2 = await fetch('http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=YOUR_API_KEY&artist=Cher&album=Believe');


    if (response.status!==200){
        throw new Error('erro no fetch');
    }



    const data = await response.json();
    await getInfo(data)
        .then(data => console.log('resolved:', data))
        .catch(err => console.log('rejected', err.message));

    //await orederalf(data);
    return data;
}

getSimilar()
    .then(data => console.log('resolved:', data))
    .catch(err => console.log('rejected', err.message));


const getInfo= async (info)=>{
    await reset();
    console.log("eu",info.results.albummatches)
    var detail=[];
    var aux=[];

    for (let i=0; i<info.results.albummatches.album.length; i++){

        aux[i]= await fetch('http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=acb24ec5f7bd68800c7bee59bdfac898&artist='+info.results.albummatches.album[i].artist+'&album='+info.results.albummatches.album[i].name+'&format=json');

    }

    for (let i=0; i<info.results.albummatches.album.length; i++){
        detail[i]= await aux[i].json();
    }


    await similardisplay(info, detail)

    return detail;

}

const similardisplay = (info, detail) =>{

    let albcov1= info.results.albummatches.album;
    var cover=[];
    var alb=[];
    var art=[];
    var genre=[];
    var playconut=[];
    var url=[];

    console.log("asdad",info.results.albummatches);

    for (let i=0; i < albcov1.length ; i++) {
        cover[i] = info.results.albummatches.album[i].image[2]['#text'];
        alb[i] = info.results.albummatches.album[i].name;
        art[i] = info.results.albummatches.album[i].artist;
        url[i] = info.results.albummatches.album[i].url;
        if (detail[i].message) {

            playconut[i] = "0";
        }else{
            playconut[i]=detail[i].album.playcount;
        }

        if (detail[i].message || detail[i].album.tags == "") {

            genre[i] = "0";
        }else {
            genre[i] = detail[i].album.tags.tag[2].name;
        }
    }


    searchh(alb, albcov1, art, cover,playconut, genre, url);


}

function searchh(alb, albcov1, art, cover, playcount, genre, url) {

    list = [];

    for (let j = 0; j < alb.length; j++) {
        list.push({'album': alb[j], 'artist': art[j], 'cover': cover[j], 'playcount': playcount[j], 'genre' : genre[j], "url":url[j]});
    }

    console.log("list",list);
    cleanall(albcov1);
    reseti();

}


function reseti(){

    if (!document.getElementById("default1")) {
        for (let k = 0; k < list.length; k++) {
            var div = document.createElement("div");
            const sec = document.getElementById("mainalb")
            div.className = "finalBlock, backi , col-md-5 , col-11";
            div.id="div"+k;
            div.innerHTML = "<a href='"+list[k].url +"'><div class='w-75 mx-auto' id='default" + k + "'><img class=' rounded' src=" + list[k].cover + "><h5  class='pt-4 d-flex text-start'>" + list[k].album + "</h5><div class='w-100'><span class='align-self-start d-flex w-50'>" + list[k].artist + "</span></div></div><div class='fundo'><img src='../lastfm_icon.png' class='iconi'></div></a> ";
            sec.appendChild(div);
        }
    }else{
        for (let k = 0; k < list.length; k++) {
            console.log("bra", list)
            document.getElementById("default" + k).innerHTML = "";
            document.getElementById("default" + k).innerHTML = "<a href='"+list[k].url +"'><div class='w-75 mx-auto' id='default" + k + "'><img class=' rounded' src=" + list[k].cover + "><h5  class='pt-4 d-flex text-start'>" + list[k].album + "</h5><div class='w-100'><span class='align-self-start d-flex w-50'>" + list[k].artist + "</span></div></div><div class='fundo'><img src='../lastfm_icon.png' class='iconi'></div></a>";
        }
    }

    genreFilter(list);
}


function genreFilter(data){

    if (document.getElementById("genre1")){
        console.log("o ifa")
        for (let k = 0; k < data.length; k++) {
            let genero=data[k].genre.toString()
            document.getElementById("genre"+k).innerHTML = "";
            document.getElementById("genre"+k).innerHTML = "<button class='generoo' id='genre" + k + "' onclick=teste('"+genero+"')><span class='mx-3'>" + data[k].genre + "</span></button>";
        }

    }else{
        console.log("o elsa")
        for (let k = 0; k < data.length; k++) {
            var div = document.createElement("div");
            const sec = document.getElementById("filter")
            let genero=data[k].genre.toString()
            div.className = "col text-center";
            div.innerHTML = "<div id='genre" + k + "'><button class='generoo'  onclick=teste('"+genero+"')><span class='mx-3'>" + data[k].genre + "</span></button></div>";
            sec.appendChild(div);
        }
    }

}

function teste(resultado){

    var listord=list
    for (let k=0; k < listord.length ; k++){

        if (listord[k].genre== resultado){
            document.getElementById("default"+k).style.display="block";
            document.getElementById("div"+k).style.display="block";
            document.getElementById("default"+k).innerHTML="<a href='"+listord[k].url +"'><div class='w-75 mx-auto' id='default" + k + "'><img class=' rounded' src=" + listord[k].cover + "><h5  class='pt-4 d-flex text-start'>" + listord[k].album + "</h5><div class='w-100'><span class='align-self-start d-flex w-50'>" + listord[k].artist + "</span></div></div><div class='fundo'><img src='../lastfm_icon.png' class='iconi'></div></a>";
        }else{
            document.getElementById("default"+k).style.display="none";
            document.getElementById("div"+k).style.display="none";
        }

    }

}

function resetgen(){

    for (let i=0; i< list.length; i++){
        document.getElementById("default"+i).style.display="block";
        document.getElementById("div"+i).style.display="block";
    }
}

function reset(){
    var listord=list
    for (let k=0; k < listord.length ; k++){
            document.getElementById("div"+k).style.display="block";
            document.getElementById("default"+k).style.display="block";

    }
}



function cleanall(albcov1){
    if (document.getElementById("default1")){
        for (let j=0; j < albcov1.length ; j++){
            document.getElementById("default"+j).innerHTML="";

        }
    }
}

const orederalf = (info) =>{

    let listord = list;
    listord.sort(function(a, b) {
        return ((a.album < b.album) ? -1 : ((a.album == b.album) ? 0 : 1));
    });
    for (let k=0; k < listord.length ; k++){
        document.getElementById("default"+k).innerHTML="";
        document.getElementById("default"+k).innerHTML="<a href='"+listord[k].url +"'><div class='w-75 mx-auto' id='default" + k + "'><img class=' rounded' src=" + listord[k].cover + "><h5  class='pt-4 d-flex text-start'>" + listord[k].album + "</h5><div class='w-100'><span class='align-self-start d-flex w-50'>" + listord[k].artist + "</span></div></div><div class='fundo'><img src='../lastfm_icon.png' class='iconi'></div></a>";
    }

}

const orederpop = (info) =>{
    let listord = list;
    listord.sort(function(a, b) {
        a=Number(a.playcount);
        b=Number(b.playcount);
        return b - a;
    });


    for (let k=0; k < listord.length ; k++){
        document.getElementById("default"+k).innerHTML="";
        document.getElementById("default"+k).innerHTML="<a href='"+listord[k].url +"'><div class='w-75 mx-auto' id='default" + k + "'><img class=' rounded' src=" + listord[k].cover + "><h5  class='pt-4 d-flex text-start'>" + listord[k].album + "</h5><div class='w-100'><span class='align-self-start d-flex w-50'>" + listord[k].artist + "</span></div></div><div class='fundo'><img src='../lastfm_icon.png' class='iconi'></div></a>";
    }

    console.log("rerew", list)

}

