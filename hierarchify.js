const fs = require('fs');
const p = fs.promises;

const inputFile = './data/products_flat.json';
const outputFile = './data/products.json';
// const rootOutputFile = './data/root_products.json';

const id2parentId = {};
const id2obj = {};
const maxValue = 10000;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function place(parent, child) {
  if (!parent['children']) { parent.children = [] }
  parent.children.push(child);
}

function hierarchify(data) {
  const root = {
    name: 'products'
  };

  data.sort( (a, b) => a.id - b.id );

  for (let d of data) {
    d.name = d.name_short_en;
    id2obj[d.id] = d;
    id2parentId[d.id] = d.parent_id;
  }

  console.log("data.length", data.length);
  console.log("Object.keys(id2parentId).length", Object.keys(id2parentId).length);

  for (let id in id2parentId) {
    const child = id2obj[id];
    const parentId = id2parentId[id];

    if (parentId === null) {
      place(root, child);
    }
    else {
      let parent = id2obj[parentId];
      place(parent, child);
    }
  }

  for (let d of data) {
    if (d["children"] === undefined) {
      d.value = getRandomInt(maxValue);
    }
  }

  return root;
}

p.readFile(inputFile)
  .then( data => JSON.parse(data).data )
  .then( data => hierarchify(data) )
  .then( nested => p.writeFile(outputFile, JSON.stringify(nested, undefined, 2)) );


// for each object in sorted 