<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Nuevo responsable
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save">
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                <li v-for="(error, index) in errors" :key="index">
                                    {{ error[0] }}
                                </li>
                            </div>
                            <div class="form-group">
                                <label for="">Identificación</label>
                                <input type="text" class="form-control" v-model="responsible.identification" maxlength="15">
                            </div>
                            <div class="form-group">
                                <label for="">Nombres</label>
                                <input type="text" class="form-control" v-model="responsible.names" maxlength="40">
                            </div>
                            <div class="form-group">
                                <label for="">Apellidos</label>
                                <input type="text" class="form-control" v-model="responsible.lastnames" maxlength="40">
                            </div>
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                <router-link class="btn btn-danger btn-sm" :to="{ name: 'responsibles.index' }"><i class="fa fa-times-circle"></i> Cancelar</router-link>
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
        name: 'responsibles.create',
        components: {
            VueLoading
        },
        data() {
            return {
                responsible: {
                    identification: '',
                    names: '',
                    lastnames: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            save () {
                this.saving = true
                this.$http.post('responsibles', this.responsible).then( response => {
                    this.$toastr.success('Responsable creado')
                    this.responsible = {
                        identification: '',
                        names: '',
                        lastnames: ''
                    }
                    this.errors = {}
                    this.saving = false
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