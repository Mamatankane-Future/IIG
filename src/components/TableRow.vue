<script lang="ts" setup>
import { ref, watch } from 'vue';
import svgData from '../assets/svgdata';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  handleDelete: {
    type: Function,
    required: true,
  },
});



const idInput = ref(svgData.data[props.id].value.id);
watch(idInput, (newValue) => {
  svgData.data[props.id].value.id = newValue;
});


const onclick = ref(svgData.data[props.id].value.onclick);
watch(onclick, (newValue) => {
  svgData.data[props.id].value.onclick = newValue;
});


const shapeValue = ref(svgData.data[props.id].value.shape);
watch(shapeValue, (newValue) => {
  svgData.data[props.id].value.shape = newValue;
});

const shapeOptions = [
  {
    value: 'rect',
    label: 'Rect',
  },
  {
    value: 'circle',
    label: 'Circle',
  },
  {
    value: 'poly',
    label: 'Poly',
  },
]

</script>

<template>
  <BTd>
      <el-select v-model="shapeValue" class="w-75 mt-2">
          <el-option
            v-for="item in shapeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
      </el-select>
  </BTd>
  <BTd>
      <el-input v-model="idInput" class="w-100 m-2" placeholder="Enter id" /></BTd>
  <BTd>
      <div class="d-flex justify-content-center">
          <el-checkbox v-model="onclick" size="large" />
      </div>
  </BTd>
  <BTd>
      <ISolartrash-bin-2-linear class="mt-2 icon text-danger" @click="() => props.handleDelete(props.id)"/>
  </BTd>
</template>

<style scoped>
    .icon{
        cursor: pointer;
    }

</style>