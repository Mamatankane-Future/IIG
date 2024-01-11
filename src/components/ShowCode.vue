<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {GenerateHtmlCode, GenerateReactCode, GenerateVueCode} from '../utils/codeGenerator'

const props = defineProps(['imageUrl','circles','rects', 'polys', 'imageDimensions', 'imageName']);

const dialogVisible = ref(false);
const codeSnippet = ref(``);
const radio = ref('HTML');
watch(radio, (newValue) =>{
  if (newValue == 'HTML') {
    radioFunction.value = generateHtmlCode;
    generateReactCode();
  }
  else if (newValue == 'React'){ 
    radioFunction.value = generateReactCode;
    generateReactCode();
  }
  else {
    radioFunction.value = generateVueCode;
    generateVueCode();
  }
})
const radioFunction = ref(generateHtmlCode);



function generateHtmlCode() {
  codeSnippet.value = GenerateHtmlCode(props.imageDimensions, props.rects, props.circles, props.polys, props.imageName);
}


function generateReactCode(){
  codeSnippet.value = GenerateReactCode(props.imageDimensions, props.rects, props.circles, props.polys, props.imageName);
}

function generateVueCode(){
  codeSnippet.value = GenerateVueCode(props.imageDimensions, props.rects, props.circles, props.polys, props.imageName);
}


function handleClick(){
  radioFunction.value();
  dialogVisible.value = true;
}

function copyToClipboard() {
  const textToCopy = codeSnippet.value;
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      ElMessage('Code copied to clipboard');
    });
}
</script>


<template>
  <el-button text @click="handleClick" :class="{ 'd-none': !props.imageUrl }">
    Show code
  </el-button>

  <el-dialog class="rounded" v-model="dialogVisible" title="Code" draggable>
    <div class="mb-3 d-flex justify-content-center">
      <el-radio-group v-model="radio" size="large">
        <el-radio-button label="HTML" />
        <el-radio-button label="Vue" />
        <el-radio-button label="React" />
      </el-radio-group>
    </div>
    <pre class="bg-secondary-subtle p-3"><code>{{codeSnippet}}</code></pre>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">
          Close
        </el-button>
        <el-button type="primary" @click="copyToClipboard">
          Copy
        </el-button>
      </span>
    </template>
  </el-dialog>
  
</template>

