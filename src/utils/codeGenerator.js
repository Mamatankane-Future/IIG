import svgData from '@/assets/svgdata';

function toString(array){
  let asString = "";
  array.forEach(element => {
    asString += ` ${element.x},${element.y}`;
  });
  return asString;
}

export const GenerateHtmlCode = (imageDimensions, rects, circles, polys, imageName) =>{
    let code = `<html>
<head>
<style>
  .shape:hover {
    opacity: 0.1;
    cursor: pointer;
  }
</style>
</head>
<body>
  <svg style="background: url('${imageName}');
      background-repeat: no-repeat;
      width: ${imageDimensions.width}px;
      height: ${imageDimensions.height}px;">`;

  rects.forEach((element, index)=> {
    code +=  `
    <rect
      x="${element.dimensions.x1}"
      y="${element.dimensions.y1}"
      width="${element.dimensions.width}"
      height="${element.dimensions.height}"
      opacity="0"
      class="shape"
      ${svgData.data[element.key]?.value.id === '' ? 'id="rect_' + index + '"' : 'id="' + svgData.data[element.key]?.value.id + '"'}
      ${svgData.data[element.key]?.value.onclick ? 'onclick="handleClick()"' : ''}
    />`;
  });

 

  circles.forEach((element, index) => {
    code += `
    <circle
      cx="${element.dimensions.x1}"
      cy="${element.dimensions.y1}"
      r="${element.dimensions.radius}"
      opacity="0"
      class="shape"
      ${svgData.data[element.key]?.value.id === '' ? 'id="circle_' + index + '"' : 'id="' + svgData.data[element.key]?.value.id + '"'}
      ${svgData.data[element.key]?.value.onclick ? 'onclick="handleClick()"' : ''}
    />`;
  });

  polys.forEach((element, index) => {
    code += `
    <polygon
      points="${toString(element.points)}"
      opacity="0"
      class="shape"
      ${svgData.data[element.key]?.value.id === '' ? 'id="poly_' + index + '"' : 'id="' + svgData.data[element.key]?.value.id + '"'}
      ${svgData.data[element.key]?.value.onclick ? 'onclick="handleClick()"' : ''}
    />
    `;
  });

  code += `
  </svg>
  <script>
    function handleClick(){
      alert("Element clicked!😜")
    }
  </script>
</body>
</html>`;

return code;
}

export const GenerateReactCode = (imageDimensions, rects, circles, polys, imageName) =>{
  let code = `import React from 'react';
function interactiveImage(){
  function handleClick(){
    alert("Element clicked!😜")
  }

  const svgStyle = {
    background: "url('${imageName}')",
    backgroundRepeat: "no-repeat",
    width: "${imageDimensions.width}px",
    height: "${imageDimensions.height}px",
  };

  const shapeStyle = {
    cursor: "pointer",
  };

  return (
    <svg style={svgStyle}>`;
    rects.forEach((element, index)=> {
      code +=  `
      <rect
        x="${element.dimensions.x1}"
        y="${element.dimensions.y1}"
        width="${element.dimensions.width}"
        height="${element.dimensions.height}"
        opacity="0"
        className="shape"
        style={shapeStyle}
        ${svgData.data[element.key]?.value.id === '' ? 'id="rect_' + index + '"' : 'id="' + svgData.data[element.key]?.value.id + '"'}
        ${svgData.data[element.key]?.value.onclick ? 'onClick={handleClick}' : ''}
      />`;
    });



    circles.forEach((element, index) => {
      code += `
      <circle
        cx="${element.dimensions.x1}"
        cy="${element.dimensions.y1}"
        r="${element.dimensions.radius}"
        opacity="0"
        className="shape"
        style={shapeStyle}
        ${svgData.data[element.key]?.value.id === '' ? 'id="circle_' + index + '"' : 'id="' + svgData.data[element.key]?.value.id + '"'}
        ${svgData.data[element.key]?.value.onclick ? 'onClick={handleClick}' : ''}
      />`;
    });

    polys.forEach((element, index) => {
      code += `
      <polygon
        points="${toString(element.points)}"
        opacity="0"
        className="shape"
        style={shapeStyle}
        ${svgData.data[element.key]?.value.id === '' ? 'id="poly_' + index + '"' : 'id="' + svgData.data[element.key]?.value.id + '"'}
        ${svgData.data[element.key]?.value.onclick ? 'onClick={handleClick}' : ''}
      />
      `;
    });

    code += `
    </svg>
  )
}
export default interactiveImage;

///add this to your styles file: .shape:hover{opacity: 0.1;}`;
  

  return code;
}

export const GenerateVueCode = (imageDimensions, rects, circles, polys, imageName) =>{
  let code = `<script setup>
  function handleClick(){
    alert("Element clicked!😜")
  }
</script>
<template>
  <svg style="background: url('${imageName}');
      background-repeat: no-repeat;
      width: ${imageDimensions.width}px;
      height: ${imageDimensions.height}px;">`;

  rects.forEach((element, index)=> {
    code +=  `
    <rect
      x="${element.dimensions.x1}"
      y="${element.dimensions.y1}"
      width="${element.dimensions.width}"
      height="${element.dimensions.height}"
      opacity="0"
      class="shape"
      ${svgData.data[element.key]?.value.id === '' ? 'id="rect_' + index + '"' : 'id="' + svgData.data[element.key]?.value.id + '"'}
      ${svgData.data[element.key]?.value.onclick ? '@click="handleClick()"' : ''}
    />`;
  });



  circles.forEach((element, index) => {
    code += `
    <circle
      cx="${element.dimensions.x1}"
      cy="${element.dimensions.y1}"
      r="${element.dimensions.radius}"
      opacity="0"
      class="shape"
      ${svgData.data[element.key]?.value.id === '' ? 'id="circle_' + index + '"' : 'id="' + svgData.data[element.key]?.value.id + '"'}
      ${svgData.data[element.key]?.value.onclick ? '@click="handleClick()"' : ''}
    />`;
  });

  polys.forEach((element, index) => {
    code += `
    <polygon
      points="${toString(element.points)}"
      opacity="0"
      class="shape"
      ${svgData.data[element.key]?.value.id === '' ? 'id="poly_' + index + '"' : 'id="' + svgData.data[element.key]?.value.id + '"'}
      ${svgData.data[element.key]?.value.onclick ? '@click="handleClick()"' : ''}
    />
    `;
  });

  code += `
  </svg>
</template>

<style scoped>
    .shape:hover {
    opacity: 0.1;
    cursor: pointer;
  }
</style>
`;

return code;
}