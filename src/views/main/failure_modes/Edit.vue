<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Editar modo de falla
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
                                <input type="text" class="form-control" v-model="failureMode.name" maxlength="40">
                            </div>
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                <router-link class="btn btn-danger btn-sm" :to="{ name: 'failureModes.index' }"><i class="fa fa-times-circle"></i> Cancelar</router-link>
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
        name: 'failureModes.edit',
        components: {
            VueLoading
        },
        created () {
            this.getFailureMode()
        },
        data() {
            return {
                failureMode: {
                    name: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            getFailureMode () {
                this.$http.get(`failure-modes/${ this.$route.params.id }`).then( response => {
                    this.failureMode = response.data
                })
            },
            save () {
                this.saving = true
                this.$http.put(`failure-modes/${ this.$route.params.id }`, this.failureMode).then( response => {
                    this.$toastr.success('Modo de falla actualizado')
                    this.$router.push({ name: 'failureModes.index' })
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