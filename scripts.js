/***************************************************************************
 *  Estudo de Caso realizado para disciplina Web Programming for Front End
 *  Data: 31/03/2024
 *  Autor: Michel Rodrigues Mota
 *  Versão: 1.0
 **************************************************************************/

// variáveis globais
let characterBaseUrl = "https://rickandmortyapi.com/api/character/?page=1";
let totalPagesElem = document.getElementById('total-page');
let currentPageElem = document.getElementById('current-page');
let searchButton = document.getElementById('search-button');
let searching = 0;
let searchingFor = '';
let currentPage = 1;

// função para buscar informações de alguma api
const fetchURL = async url => {
    // aguardo o retorno dos dados, que seria a resposta do servidor
    let resp = await fetch(url);
    // transformo os dados retornados em JSON
    let data = await resp.json();

    // toda informação é retornada na variavel data
    return data
};

// função para buscar os personagens do rick and morty e plotar na tela
const getRickAndMortyData = async url => {
    try{
        let data = await fetchURL(url);
        let arrayOfResults = getResultsOfPage(data.results);
        totalPagesElem.innerText = data.info.pages;
    
        // função que exibe de fato os elementos que foram buscados
        fillTheHTMLContainer(arrayOfResults);
    }
    // caso não consiga encontrar os dados, chama a função para criar o conteúdo de que não foi encontrado
    catch{
        totalPagesElem.innerText = 1;
        createNotFound();
    }
}

// retorna um array de elementos para exibir na tela
const getResultsOfPage = results => {
    let arrayToDisplay = [];
    // armazeno todos os elementos de results em um array e o retorno no final da função
    results.forEach(elem => {
        arrayToDisplay.push(elem);
    });
    return arrayToDisplay;
}

// exibe o array de elementos
const fillTheHTMLContainer = array => {
    // garante que sempre que a função for chamada para preencher com novos dados, o container será limpo
    clearHTMLContainer();
    // para cara elemento do array, cria uma visualização
    array.forEach(elem => createCardToDisplayCharacters(elem) );
}

// reseta o container no HTML
const clearHTMLContainer = () => {
    // pega o container dos elementos e limpa
    let container = document.getElementsByClassName('container')[0];
    container.innerText = ""
}

// função que vai preencher o container com os dados pegos primeiramente da API e depois transformado em array, sera trabalhado para cada elemento do array
const createCardToDisplayCharacters = result => {
    // Pegando div onde serão criados
    const mainContainer = document.getElementsByClassName('container')[0];

    // Criando Elementos HTML
    let cardContainer = document.createElement('article');
    let imgContainer = document.createElement('div');
    let img = document.createElement('img');
    let infoContainer = document.createElement('div');
    let sectionClass1 = document.createElement('div');
    let nameH2 = document.createElement('h2');
    let spanStatus = document.createElement('span');
    let statusIcon = document.createElement('span');
    let sectionClass2 = document.createElement('div');
    let spanGray1 = document.createElement('span');
    let lastLocation = document.createElement('a');
    let sectionClass3 = document.createElement('div');
    let spanGray2 = document.createElement('span');
    let firstLocation = document.createElement('a');

    // Atribuindo valores, classes e atributos
    img.setAttribute('src', result.image);
    infoContainer.setAttribute('class', 'info-container');
    sectionClass1.setAttribute('class', 'section');
    sectionClass2.setAttribute('class', 'section');
    sectionClass3.setAttribute('class', 'section');
    nameH2.innerText = result.name;
    spanStatus.setAttribute('class','status');
    statusIcon.setAttribute('class', 'status-icon')
    result.status == 'Dead' ? statusIcon.setAttribute('id','dead') : result.status == 'Alive' ? statusIcon.setAttribute('id','alive') : result.status == 'unknown' ? statusIcon.setAttribute('id','unknown') : null;
    spanStatus.innerText = `${result.status} - ${result.species}`;
    spanGray1.setAttribute('class', 'gray-text');
    spanGray1.innerText = `Última localização conhecida:`
    lastLocation.setAttribute('id', 'last-location');
    lastLocation.innerText = result.location.name;
    spanGray2.setAttribute('class', 'gray-text');
    spanGray2.innerText = `Apareceu primeiro em:`;
    firstLocation.setAttribute('id', 'first-location');
    firstLocation.innerText = result.origin.name;

    // Aninhando elementos criados com JS
    mainContainer.appendChild(cardContainer);
    cardContainer.append(imgContainer, infoContainer);
    imgContainer.appendChild(img);
    infoContainer.append(sectionClass1, sectionClass2, sectionClass3);
    sectionClass1.append(nameH2, spanStatus);
    spanStatus.insertBefore(statusIcon, spanStatus.firstChild);
    sectionClass2.append(spanGray1, lastLocation);
    sectionClass3.append(spanGray2, firstLocation);

    // essa parte vai cuidar das informações dos locais, quando abrir e fechar
    let locations = [lastLocation, firstLocation];
    handleLocationToggle(locations, result);
/*
    <article>
        <div>
            <img src="https://rickandmortyapi.com/api/character/avatar/206.jpeg"/>
        </div>
        <div class="info-container">
            <div class="section">
                <h2>NOME</h2>
                <span class="status">
                    <span class="status-icon"></span>
                    Vivo - Humano
                </span>
            </div>
            <div class="section">
                <span class="gray-text">Última localização conhecida:</span>
                <a href="#">Local</a>
            </div>
            <div class="section">
                <span class="gray-text">Apareceu primeiro em:</span>
                <a href="#">Local</a>
            </div>
        </div>
    </article>
*/
}

// essa função vai preencher o container quando não forem encontrados dados da API
const createNotFound = () => {
    let container = document.getElementsByClassName('container')[0];
    let imgUrl = './img/sad-morty-notfound.webp';

    // para garantir que não terá nada antes de colocar o conteúdo no container
    clearHTMLContainer();
    
    // criando os elementos e definindo os atributos
    let div = document.createElement('div');
    div.setAttribute('class','not-found-container');

    let p = document.createElement('p');
    p.innerText = 'O termo que você procurou não foi encontrado, tente por outro :)';

    let img = document.createElement('img');
    img.setAttribute('src', imgUrl);

    container.appendChild(div);
    div.append(p, img);
}

// função para controlar a aparição das informações de localização da api
const handleLocationToggle = async (locations, result) => {
    let toggled = 0;
    let locationUrl = '';
    let idElem = null;
    let data = null;

    // para cada opção de local, como ultimo visto e origem, eu coloco um escutador e defino as opções para criar o elemento
    locations.forEach(location => {
        location.addEventListener('click', async ev => {
            if(ev.target.id === 'last-location' ){
                if(!toggled){
                    idElem = ev.target;
                    locationUrl = result.location.url;
                    create(idElem);
                    toggled = 1;
                }
            }
            if(ev.target.id === 'first-location' ){
                if(!toggled){
                    idElem = ev.target;
                    locationUrl = result.origin.url;
                    create(idElem);
                    toggled = 1;
                }   
            }
            if(ev.target.classList.contains('location-container')){
                let locationContainerParentNode = ev.target.parentNode;
                let locationContainerChildren = [...locationContainerParentNode.children];

                locationContainerChildren.forEach(child => {
                    locationContainerParentNode.removeChild(child);
                })
                toggled = 0
            }
        })
    })

    const create = async target => {
        if(toggled){
            let children = [...target.children];
            children.forEach(child => {
                target.removeChild(child);
            })
        }else{
            // busca as informações por fim e cria
            data = await fetchURL(locationUrl);
            createLocationContainer(target, data);
        }
    }
    
}

// usado para criar o lugar onde vai as informações de localização no HTML
const createLocationContainer = async (parentElement, locationInfo) => {
    /*  APENAS PARA VISUALIZAÇÃO DE COMO FICARÁ NO HTML
    <div class="division"></div>
    <div class="location-container">
        Nome
        <span>tipo</span>
        dimensao
        número de residentes: <span id="resident-number"></span>
    </div>
    */
    
    // crio os elementos e seto os atributos
    let division = document.createElement('div');
    division.setAttribute('class','division');

    let locationContainer = document.createElement('div');
    locationContainer.setAttribute('class', 'location-container');

    let type = document.createElement('span');
    type.innerText = locationInfo.type;

    let residentNumber = document.createElement('span');
    residentNumber.setAttribute('class','resident-number');
    residentNumber.style.color = '#52057b';
    residentNumber.innerText = locationInfo.residents.length;

    // adiciono no container
    locationContainer.innerText += `Nome: ${locationInfo.name}
    Tipo: ${type.innerText}
    Dimensão: ${locationInfo.dimension}
    Residentes: ${residentNumber.innerText}`
    
    
    parentElement.append(division,locationContainer);
}

// função de busca pelo nome
const searchByName = () => {   
    // vou criar um listener tanto para o click   
    searchButton.addEventListener('click', () => {
        search();
    })
    // quanto para o pressionar da tecla enter
    window.addEventListener('keypress', ev => {
        if(ev.key === 'Enter'){
            search();
        }
    })

    // função que vai realmente fazer o search na API
    const search = () => {
        // lembrar de a cada search resetar algumas variáveis importantes como a página atual
        currentPageElem.innerText = 1;
        currentPage = 1;

        let name = document.getElementById('search-input').value;

        // Monta a URL com o filtro de nome
        let currentUrl = characterBaseUrl + `&name=${name}`;

        // Obtém e exibe os personagens filtrados
        getRickAndMortyData(currentUrl);

        // atualiza as variaveis de auxílio para outras funções para controle de página
        searching = 1;
        searchingFor = currentUrl;
    }
}

// função de controle de página
const pageControl = () => {
    let startPage = 1;
    // faço um espalhamento dos botões de troca de página, por mais que tenham apenas dois
    let buttons = [...document.getElementsByClassName('buttons-page')];

    // para cada um deles, adiciono um escutador que vai buscar trocando a url baseado na pesquisa ou não do usuário
    buttons.forEach(button => {
        button.addEventListener('click', ev => {
            if(searching){
                getPagesChanged('searching', ev.target.id)

            }else{
                searching = 0
                getPagesChanged('notsearching', ev.target.id)
            }

        })
    });

    const getPagesChanged = async (searchType, id) => {
        // caso esteja pesquisando, a variavel searching estara ativa e a url sera a searchingFor (atualizamos na função search)
        searchType == 'searching' ? newUrl = searchingFor : newUrl = characterBaseUrl;

        // atualizo o total de páginas, para trabalhar com ele atualizado
        data = await fetchURL(newUrl);
        totalPage = data.info.pages;

        // dependendo do id do click, adiciona ou subtrai da página atual, lembrando de verificar se a página atual é a primeira ou a última para não dar erro
        id == 'left' ? currentPage == 1 ? null : currentPage-- : null ;
        id == 'right' ? currentPage == totalPage ? null : currentPage++  : null ;

        // depois de garantir a função dos botões de click, atualizamos a url para uma nova e fazemos a busca dos dados da API do Rick and Morty
        newUrl = newUrl.replace(startPage,currentPage);

        currentPageElem.innerText = currentPage;
        getRickAndMortyData(newUrl);
    }
}

// chama a função com o carregamento da página e garante o funcionamento das funções auxiliares
window.addEventListener('load', () => {
    currentPageElem.innerText = 1;
    // as variaveis globais são trocadas aqui até a atualização da página, onde ela carregará novamente resetando todos os valores
    getRickAndMortyData(characterBaseUrl)
    searchByName()
    pageControl()
});
