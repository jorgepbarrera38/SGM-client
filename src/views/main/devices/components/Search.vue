<template>
    <div class="row">
        <div class="col-md-12">
            <div class="form-row">
                <div class="form-group col-md-3">
                    <label for="">Elemento</label>
                    <select name="" class="form-control" v-model="search.location">
                        <option value="">Seleccione elemento</option>
                    </select>
                </div>
                <div class="form-group col-md-3">
                    <label for="">Ubicación</label>
                    <select name="" class="form-control" v-model="search.location">
                        <option value="">Seleccione ubicación</option>
                    </select>
                </div>
                <div class="form-group col-md-3">
                    <label for="">Dependencia</label>
                    <select name="" class="form-control" v-model="search.location">
                        <option value="">Seleccione dependencia</option>
                    </select>
                </div>
                <div class="form-group col-md-2">
                    <label for="">Placa o serial</label>
                    <input type="text" class="form-control" v-model="search.internal_code" placeholder="Placa o serial">
                </div>
                <div class="form-group col-md-1">
                    <label for="" style="opacity:0">JAPB</label>
                    <button type="submit" class="btn btn-primary mb-2" @click="emitSearch"><i class="fa fa-search"></i> Buscar</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            search: {
                internal_code: '',
                location: ''
            }
        }
    },
    methods: {
        emitSearch () {
            this.$emit('searching', this.search)
        }
    },
}
</script>