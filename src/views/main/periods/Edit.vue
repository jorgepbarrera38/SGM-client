<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Editar periodo de mantenimiento
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save">
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                <li v-for="(error, index) in errors" :key="index">
                                    {{ error[0] }}
                                </li>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-4">
                                    <label for="">Nombre</label>
                                    <input type="text" class="form-control" v-model="period.name" maxlength="30">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="">Inicio</label>
                                    <input type="date" class="form-control" v-model="period.start">
                                </div>
                                <div class="form-group col-md-4">
                                    <label for="">Fin</label>
                                    <input type="date" class="form-control" v-model="period.end">
                                </div>
                            </div>
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                <router-link class="btn btn-danger btn-sm" :to="{ name: 'periods.index' }"><i class="fa fa-times-circle"></i> Cancelar</router-link>
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
        name: 'periods.edit',
        components: {
            VueLoading
        },
        created () {
            this.getPeriod()
        },
        data() {
            return {
                period: {
                    name: '',
                    start: '',
                    end: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            getPeriod () {
                this.$http.get(`periods/${ this.$route.params.id }`).then( response => {
                    this.period = response.data
                })
            },
            save () {
                this.saving = true
                this.$http.put(`periods/${ this.$route.params.id }`, this.period).then( response => {
                    this.$toastr.success('Periodo actualizado')
                    this.$router.push({ name: 'periods.index' })
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