<script setup lang="ts">
import { ref} from 'vue';
import svgData from '../assets/svgdata';

const imageUrl = ref<string | null>(null);
const imageName = ref('');
const imageDimensions = ref({height: 0, width: 0});
const draggingItem = ref(null);
const draggingKey = ref(null);
const executeWhichFunction = ref(null);
const offset = ref({x: 0, y: 0});
const polyIndex = ref(0);


const child = ref(null);

const getActive = () => child.value.getActive();
const setActive = (value) => child.value.setActive(value);
const addNewRow = (shape) => child.value.addNewRow(shape);
const removeRow = (index) => child.value.removeRow(index);
const removeAll = () => child.value.removeAll();

const rectPoints = ref([]);
const circlePoints = ref([]);
const polyPoints = ref([]);



function handleImageChange(event: Event){
  const inputImage = (event.target as HTMLInputElement).files?.[0];

  if (inputImage) {
    imageUrl.value = URL.createObjectURL(inputImage);
    imageName.value = inputImage.name;
    const imgElement = new Image();
    imgElement.src = imageUrl.value;

    imgElement.onload = () => {
      imageDimensions.value = {
        width: imgElement.width,
        height: imgElement.height,
      };
    };

  }

  polyPoints.value = [];
  circlePoints.value = [];
  rectPoints.value = [];
  removeAll();
};

function handleClick(event) {
  const defaultValue = 30;
  var x1 = event.clientX - event.target.getBoundingClientRect().left;
  var y1 = event.clientY - event.target.getBoundingClientRect().top;
  
  if (svgData.data[getActive()].value.shape == 'rect') {
    let index = rectPoints.value.findIndex((point)=> point.key == getActive());
    if (index <= -1){
      rectPoints.value.push({key: getActive(), dimensions: { x1: x1, y1: y1 , x2: x1 + defaultValue, y2: y1+ defaultValue, width: defaultValue, height: defaultValue }});
      index = circlePoints.value.findIndex((point)=> point.key == getActive());
      if (index > -1){
        circlePoints.value.splice(index, 1);
      }
      else {
        index = polyPoints.value.findIndex((point)=> point.key == getActive());
        if (index > -1){
          polyPoints.value.splice(index, 1);
        }
      }
    }
  }
  else if (svgData.data[getActive()].value.shape == 'circle'){
    let index = circlePoints.value.findIndex((point)=> point.key == getActive());
    if (index <= -1){
      circlePoints.value.push({key: getActive(), dimensions: { x1: x1, y1: y1, x2: x1 + defaultValue , radius: defaultValue}});
      index = rectPoints.value.findIndex((point)=> point.key == getActive());
      if (index > -1){
        rectPoints.value.splice(index, 1);
      }
      else {
        index = polyPoints.value.findIndex((point)=> point.key == getActive());
        if (index > -1){
          polyPoints.value.splice(index, 1);
        }
      }
    }
  }
  else if (svgData.data[getActive()].value.shape == 'poly'){
    let index = polyPoints.value.findIndex((point)=> point.key == getActive());
    let point = {x: x1, y: y1}
    if (index <= -1){
      polyPoints.value.push({key: getActive(), points: [point]});
      index = circlePoints.value.findIndex((point)=> point.key == getActive());
      if (index > -1){
        circlePoints.value.splice(index, 1);
      }
      else {
        index = rectPoints.value.findIndex((point)=> point.key == getActive());
        if (index > -1){
          rectPoints.value.splice(index, 1);
        }
      }
    }
    else {  
      let points = [...polyPoints.value[index].points, point];
      polyPoints.value[index] = {key: getActive(), points: points}
    }
  }
}

window.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
  if (event.key === 'v' && (event.ctrlKey || event.metaKey)) {
    if (svgData.data[getActive()].value.shape == 'rect'){
        let index = rectPoints.value.findIndex((point)=> point.key == getActive());
        let key = addNewRow("rect");
        rectPoints.value.push({key: key, dimensions: {...rectPoints.value[index].dimensions}});
        setActive(key);
    }
    else if (svgData.data[getActive()].value.shape == 'circle'){
      let index = circlePoints.value.findIndex((point)=> point.key == getActive());
      let key = addNewRow("circle");
      circlePoints.value.push({key: key, dimensions: {...circlePoints.value[index].dimensions}});
      setActive(key);
    }
    else if (svgData.data[getActive()].value.shape == 'poly'){
      let index = polyPoints.value.findIndex((point)=> point.key == getActive());
      let key = addNewRow("poly");
      polyPoints.value.push({key: key, dimensions: {...polyPoints.value[index].points}});
      setActive(key);
    }
  }   
  else if (event.key === 'Delete') {
    if (svgData.data[getActive()].value.shape == 'rect'){
        rectPoints.value = rectPoints.value.filter((point)=> point.key != getActive());
        removeRow(getActive());
    }
    else if (svgData.data[getActive()].value.shape == 'circle'){
      circlePoints.value = circlePoints.value.filter((point)=> point.key != getActive());
      removeRow(getActive());
    }
    else if (svgData.data[getActive()].value.shape == 'poly'){
      polyPoints.value = polyPoints.value.filter((point)=> point.key != getActive());
      removeRow(getActive());
    }
  }   
}

function handleDelete(index: number){
  circlePoints.value= circlePoints.value.filter((point) => point.key != index);
  rectPoints.value = rectPoints.value.filter((point)=> point.key != index);
  polyPoints.value = polyPoints.value.filter((point)=> point.key != index);
}

function setPolyIndex(value){
  polyIndex.value = value;
}
function handleDrag(key, event, execute){
  executeWhichFunction.value = execute;
  handleDraggables[execute](event, key);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', stopDrag);
}

function drag(event) {
  draggables[executeWhichFunction.value](event);
  
}

function stopDrag() {
  draggingItem.value = null;
  draggingKey.value = null;
  executeWhichFunction.value = null;
  polyIndex.value = null;
  offset.value = {x: 0, y: 0}
  window.removeEventListener('mousemove', drag);
  window.removeEventListener('mouseup', stopDrag);
}


function toString(array){
  let asString = "";
  array.forEach(element => {
    asString += ` ${element.x},${element.y}`;
  });
  return asString;
}

const handleDraggables = [
  (event,key) => {
    let index = rectPoints.value.findIndex((point)=> point.key == key);
    draggingItem.value = index;
    draggingKey.value = key;
    offset.value = {
        x: event.clientX - rectPoints.value[index].dimensions.x1,
        y: event.clientY - rectPoints.value[index].dimensions.y1,
    };
  },

  (event, key) => {
    let index = circlePoints.value.findIndex((point)=> point.key == key);
    draggingItem.value = index;
    draggingKey.value = key;
    offset.value = {
      x: event.clientX - circlePoints.value[index].dimensions.x1,
      y: event.clientY - circlePoints.value[index].dimensions.y1,
    };
  },

  (event, key) =>{
    let index = rectPoints.value.findIndex((point)=> point.key == key);
    draggingItem.value = index;
    draggingKey.value = key;
    offset.value = {
        x: event.clientX - rectPoints.value[index].dimensions.x1,
        y: event.clientY - rectPoints.value[index].dimensions.y1,
    };
  },
  (event, key) =>{ 

    let index = rectPoints.value.findIndex((point)=> point.key == key);
    draggingItem.value = index;
    draggingKey.value = key;
   
    offset.value = {
        x: event.clientX - rectPoints.value[index].dimensions.x2,
        y: event.clientY - rectPoints.value[index].dimensions.y2,
    };
  },
  (event, key) =>{
    let index = circlePoints.value.findIndex((point)=> point.key == key);
    draggingItem.value = index;
    draggingKey.value = key;
    offset.value = {
        x: event.clientX - circlePoints.value[index].dimensions.x2,
        y: 0,
    };
  },
  (event, key) =>{
    let index = polyPoints.value.findIndex((point)=> point.key == key);
    draggingItem.value = index;
    draggingKey.value = key;
    offset.value = {
        x: event.clientX - polyPoints.value[index].points[0].x,
        y: event.clientY - polyPoints.value[index].points[0].y,
    };
  },
  (event, key) =>{
    let index = polyPoints.value.findIndex((point)=> point.key == key);
    draggingItem.value = index;
    draggingKey.value = key;
    offset.value = {
        x: event.clientX - polyPoints.value[index].points[polyIndex.value].x,
        y: event.clientY - polyPoints.value[index].points[polyIndex.value].y,
    };
  },
];


const draggables =[
  (event) => {
    if (draggingItem.value !== null) {
      const h = rectPoints.value[draggingItem.value].dimensions.height;
      const w = rectPoints.value[draggingItem.value].dimensions.width;
      const x1 = event.clientX - offset.value.x;
      const y1 = event.clientY - offset.value.y;
      const x2 = x1 + w;
      const y2 = y1 + h;
      rectPoints.value[draggingItem.value].dimensions ={ x1: x1, y1: y1 ,  x2: x2, y2: y2, width: w, height: h};
    }
  },
  (event) => {
    if (draggingItem.value !== null){
      const r = circlePoints.value[draggingItem.value].dimensions.radius;
      const x1 = event.clientX - offset.value.x;
      const y1 = event.clientY - offset.value.y;
      const x2 = x1 + r;

      circlePoints.value[draggingItem.value].dimensions = { x1: x1, y1: y1, x2: x2, radius: r};
    }
  },

  (event) => {
    if (draggingItem.value !== null){
        const x2 = rectPoints.value[draggingItem.value].dimensions.x2;
        const y2 = rectPoints.value[draggingItem.value].dimensions.y2;
        let x1 = event.clientX - offset.value.x;
        let y1 = event.clientY - offset.value.y;
        let h = rectPoints.value[draggingItem.value].dimensions.height;
        let w = rectPoints.value[draggingItem.value].dimensions.width;
        if (y2>y1) h = y2 - y1;
        else y1 = rectPoints.value[draggingItem.value].dimensions.y2;
        if (x2>x1) w = x2 - x1;
        else x1 = rectPoints.value[draggingItem.value].dimensions.x1;
        
        rectPoints.value[draggingItem.value].dimensions = { x1: x1, y1: y1 ,  x2: x2, y2: y2, width: w, height: h};  
    }
  },
  (event) => {
    if (draggingItem.value !== null){
        const x1 = rectPoints.value[draggingItem.value].dimensions.x1;
        const y1 = rectPoints.value[draggingItem.value].dimensions.y1;
        let x2 = event.clientX - offset.value.x;
        let y2 = event.clientY - offset.value.y;
        let h = rectPoints.value[draggingItem.value].dimensions.height;
        let w = rectPoints.value[draggingItem.value].dimensions.width;
        if (y2>y1) h = y2 - y1;
        else y2 = rectPoints.value[draggingItem.value].dimensions.y2;
        if (x2>x1) w = x2 - x1;
        else x2 = rectPoints.value[draggingItem.value].dimensions.x2;
        rectPoints.value[draggingItem.value].dimensions = { x1: x1, y1: y1 ,  x2: x2, y2: y2, width: w, height: h}
      }
  },
  (event) => {
    if (draggingItem.value !== null){
      const x1 = circlePoints.value[draggingItem.value].dimensions.x1;
      const y1 = circlePoints.value[draggingItem.value].dimensions.y1;
      let x2 = event.clientX - offset.value.x;
      let r = circlePoints.value[draggingItem.value].dimensions.radius;
      if (x2>x1) r = x2 - x1;
      else x2 = circlePoints.value[draggingItem.value].dimensions.x2;
      circlePoints.value[draggingItem.value].dimensions = {x1: x1, y1: y1, x2: x2, radius: r }
     
    }
  },
  (event) => {
    if (draggingItem.value !== null){
      const tempArray = polyPoints.value[draggingItem.value].points;
      const tempx =  event.clientX - offset.value.x;
      const tempy =  event.clientY - offset.value.y;
      for (let i=1; i<tempArray.length; i++){
        // calculate the difference between the first point and all the other points
        const differencex = tempArray[i].x - tempArray[0].x; 
        const differencey = tempArray[i].y - tempArray[0].y; 
        tempArray[i].x = tempx + differencex;
        tempArray[i].y = tempy + differencey;
       
      }
      tempArray[0].x = tempx;
      tempArray[0].y = tempy;
    }
  },
  (event) => {
    if (draggingItem.value !== null){
      const tempArray = polyPoints.value[draggingItem.value].points;
      tempArray[polyIndex.value].x = event.clientX - offset.value.x;
      tempArray[polyIndex.value].y = event.clientY - offset.value.y;
    }
  }
]

</script>

<template>
  <div class="container d-flex flex-column mt-5 align-items-center">
    <label for="image-input" class="image-input-label text-white py-2 px-3 rounded h5">Select image</label>
    <input type="file" id="image-input" accept="image/jpeg, image/jpg, image/png, image/svg" class="d-none" @change="handleImageChange" />
    <svg v-if="imageUrl" class="image-wrapper" :style="{ 
        background: 'url(' + imageUrl + ')',
        'background-repeat': 'no-repeat',
        width: imageDimensions.width + 'px', 
        height: imageDimensions.height + 'px'
      }" 
      @click.self="handleClick"
    >

      <g v-for="(point) in rectPoints" :key="point.key">
        <rect 
          :x="point.dimensions.x1"
          :y="point.dimensions.y1"
          :width="point.dimensions.width"
          :height="point.dimensions.height"
          class="grabbable"
          stroke="black"
          fill="gray"
          opacity="0.4"
          @mousedown="handleDrag(point.key,$event,0)"
          @click="setActive(point.key)"
        />
        <circle v-if="point.key== getActive()"
          class="pointable"
          :cx="point.dimensions.x1"
          :cy="point.dimensions.y1"
          stroke="black"
          opacity="0.5"
          fill="white"
          r="5"
          @mousedown="handleDrag(point.key, $event,2);"
          
        />
        <circle v-if="point.key== getActive()"
          class="pointable"
          :cx="point.dimensions.x2"
          :cy="point.dimensions.y2"
          stroke="black"
          opacity="0.5"
          fill="white"
          r="5"
          @mousedown="handleDrag(point.key, $event,3)"
        />
      </g>

        
      <g v-for="(point) in circlePoints" :key="point.key">
        <circle
          :cx="point.dimensions.x1"
          :cy="point.dimensions.y1"
          :r="point.dimensions.radius"
          class="grabbable"
          stroke="black"
          fill="gray"
          opacity="0.4"
          @mousedown="handleDrag(point.key,$event, 1)"
          @click="setActive(point.key)"
        />
        <circle v-if="point.key== getActive()"
          :cx="point.dimensions.x1"
          :cy="point.dimensions.y1"
          stroke="black"
          opacity="0.5"
          fill="white"
          r="5"
        />
        <circle v-if="point.key== getActive()"
          class="pointable"
          :cx="point.dimensions.x2"
          :cy="point.dimensions.y1"
          stroke="black"
          opacity="0.5"
          fill="white"
          r="5"
          @mousedown="handleDrag(point.key, $event,4)"
        />
      </g>

      <g v-for="(point) in polyPoints" :key="point.key">
        <polygon
          :points="toString(point.points)"
          class="grabbable"
          stroke="black"
          fill="gray"
          opacity="0.4"
          @click="setActive(point.key)"
          @mousedown="handleDrag(point.key, $event, 5)"
        />
        <g v-for="(p, index) in point.points" :key="index">
          <circle v-if="point.key== getActive()"
            class="pointable"
            :cx="p.x"
            :cy="p.y"
            stroke="black"
            opacity="0.5"
            fill="white"
            r="5"
            @mousedown="($event) =>{
              setPolyIndex(index);
              handleDrag(point.key, $event, 6);
            }"
          />
        </g>

      </g>
    </svg>

    <div class="pt-3">
      <PointsTable :imageUrl="imageUrl" :handleDelete="handleDelete" ref="child"/>
    </div>
    <div class="pt-3">
      <ShowCode :imageUrl="imageUrl" :circles="circlePoints" :rects="rectPoints" :polys="polyPoints" :imageDimensions="imageDimensions" :imageName="imageName"/>
    </div>
  </div>
</template>



<style scoped>
  .image-input-label{
    cursor: pointer;
    background: #79bbff;
  }

  .grabbable{
    cursor: grab;
  }

  .image-input-label:hover{
    background-color: rgba(0, 123, 255,0.4)
  }

  .gylphs-wrapper{
    width: 100%;
    
  }

  .pointable{
    cursor: pointer;
  }



</style>