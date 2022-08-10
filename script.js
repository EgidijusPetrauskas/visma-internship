"use strict";

const imagesMenu = document.querySelector(".images-menu");
const imagesDiv = document.querySelector(".images");
const displayContaienr = document.querySelector(".display-container");
const blurContainer = document.querySelector("#blur-container");
const info = document.querySelector(".info");
const grayscaleFilter = document.querySelector("#grayscale");
const blurFilter = document.querySelector("#blur");

let ApiPageNumber = 1;
let selectedImgIndex = 0;
const imagesDb = [];

const fetchImages = async (page) => {
  const res = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=12`);
  const data = await res.json();
  return data;
};

const loadImages = async (images) => {
  images.forEach(img => imagesDb.push(img));
  images.forEach(img => {
    const newImg = document.createElement('img');
    newImg.classList.add('menu-img')
    newImg.setAttribute('src', img.download_url)
    newImg.setAttribute('oncontextmenu', "return false");

    newImg.addEventListener('click', () => {
      selectedImgIndex = imagesDb.indexOf(img);
      makeActive(selectedImgIndex);
      displayImg(img);
    });
    
    imagesDiv.append(newImg);
  });
};

const init = async () => {
  const images = await fetchImages(ApiPageNumber);
  loadImages(images);
  displayImg(images[0])
  makeActive(selectedImgIndex);
  setTimeout(() => {
    loader.remove();
  }, 90);
};

const makeActive = (indx) => {
  const allImages = document.querySelectorAll('.menu-img');
  allImages.forEach(x => x.classList.remove('active'));
  allImages[indx].classList.add('active');
};

const displayImg = (imgObj) => {
  displayContaienr.innerHTML = '';
  const newDisplay = document.createElement('img');
  newDisplay.setAttribute('src', imgObj.download_url);
  newDisplay.setAttribute('oncontextmenu', "return false");
  displayContaienr.append(newDisplay);

  info.innerHTML = `
    <h3 id="author">${imgObj.author}</h3>
    <h3 id="img-size">${imgObj.width}x${imgObj.height}</h3>
  `;
};

const addBlur = (blurValue) => {
  blurContainer.style.filter = `blur(${blurValue}px)`;
};

const addGray = (checked) => {
  checked ? displayContaienr.style.filter = 'grayscale(100%)': displayContaienr.style.filter = 'grayscale(0)';
};

const prevImg = () => {
  if(selectedImgIndex > 0 ) selectedImgIndex--;
  makeActive(selectedImgIndex);
  displayImg(imagesDb[selectedImgIndex]);
};

const nextImg = () => {
  const allImages = document.querySelectorAll('.menu-img')
  if(selectedImgIndex < allImages.length -1 ) selectedImgIndex++;
  makeActive(selectedImgIndex);
  displayImg(imagesDb[selectedImgIndex]);
};

//Main
const loader = document.createElement('div');
loader.innerHTML = `
  <div class="loader">...</div>
`;
document.body.append(loader);

init();

imagesMenu.addEventListener('scroll', async () => {
  if (imagesMenu.scrollTop + imagesMenu.clientHeight >= imagesMenu.scrollHeight) {
    ApiPageNumber++;
    const images = await fetchImages(ApiPageNumber);
    loadImages(images);
  };
});