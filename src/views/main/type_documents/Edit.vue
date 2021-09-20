<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Editar tipo de documento
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save">
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                <li v-for="(error, index) in errors" :key="index">
                                    {{ error[0] }}
                                </li>
                            </div>
                            <div class="form-group">
                                <label for="">Nombre</label>
                                <input type="text" class="form-control" v-model="typeDocument.name" maxlength="40">
                            </div>
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                <router-link class="btn btn-danger btn-sm" :to="{ name: 'typeDocuments.index' }"><i class="fa fa-times-circle"></i> Cancelar</router-link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    export default {
        name: 'typeDocuments.edit',
        components: {
            VueLoading
        },
        created () {
            this.getTypeDocument()
        },
        data() {
            return {
                typeDocument: {
                    name: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            getTypeDocument () {
                this.$http.get(`type-documents/${ this.$route.params.id }`).then( response => {
                    this.typeDocument = response.data
                })
            },
            save () {
                this.saving = true
                this.$http.put(`type-documents/${ this.$route.params.id }`, this.typeDocument).then( response => {
                    this.$toastr.success('Tipo de documento actualizado')
                    this.$router.push({ name: 'typeDocuments.index' })
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>