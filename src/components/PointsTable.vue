<script lang="ts" setup>
import { BTableSimple } from 'bootstrap-vue-next';
import { ref, watch } from 'vue';
import svgData from '@/assets/svgdata';

const tableData = ref(svgData.data.filter((data) => data !== null).map((data) => data.id));
let active = ref(0);

const getActive =() => active.value;

const setActive = (newValue) => {
    active.value = newValue;
}

const addNewRow = (shape) =>{
    return addNewObject(shape);
}

const removeRow = (index) =>{
    handleDelete(index);
}

const removeAll = () =>{
    tableData.value = tableData.value.filter((element) => active.value == element);
}

defineExpose({
    getActive,
    setActive,
    addNewRow,
    removeRow,
    removeAll,
})

const props = defineProps({
    imageUrl: {
        type: Number,
        required: true,
    },
    handleDelete: {
        type: Function,
        required: true,
    }
})

const addNewObject = (shape) => {
    svgData.lastStamp++;
    svgData.data.push(
        {
            id: svgData.lastStamp,
            value: {
                shape: shape,
                id: "",
                onclick: false,
    
            },
        }
    );
    tableData.value.push(svgData.lastStamp);
    active.value = svgData.lastStamp;
    return svgData.lastStamp;
}
const handleDelete = (index: number) => {
    if (tableData.value.length==1) return;
    svgData.data[index] = null;
    tableData.value = tableData.value.filter((n: number, i: number) => {
        if (n == index) {
            if (active.value == index) {
                if (i >= tableData.value.length -1) active.value = tableData.value[0];
                else active.value = tableData.value[i+1];
            }
            return false;
        }
        else return true;
    });
    props.handleDelete(index);
}

</script>


<template>
    <div class="d-flex flex-column align-items-center" :class="{ 'd-none': !props.imageUrl }">
        <BTableSimple responsive>
            <BThead>
                <BTr>
                  <BTh>Active</BTh>
                  <BTh>Shape</BTh>
                  <BTh>Id</BTh>
                  <BTh>Onclick</BTh>
                  <BTh></BTh>
                </BTr>
              </BThead>
              <BTbody>
                <BTr v-for="(data) in tableData"
                    :key="data"
                    :id="data"
                    :handleDelete="handleDelete"
                >
                    <BTd>
                        <div class="d-flex justify-content-center">
                            <BFormRadio class="mt-3" v-model="active" name="some-radios" :value="data"></BFormRadio>
                        </div>
                    </BTd>
                    <TableRow :handleDelete="handleDelete" :id="data"/>
                </BTr>
              </BTbody>
        </BTableSimple>
        <ITablerplus class="mt-3 h4 icon" @click="addNewObject('rect')"/>
    </div>

</template>

<style scoped>
    .icon{
        cursor: pointer;
    }

</style>
  
  