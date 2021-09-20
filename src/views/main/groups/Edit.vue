<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Editar grupo
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
                                <input type="text" class="form-control" v-model="group.name" maxlength="30">
                            </div>
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                <router-link class="btn btn-danger btn-sm" :to="{ name: 'groups.index' }"><i class="fa fa-times-circle"></i> Cancelar</router-link>
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
        name: 'groups.edit',
        components: {
            VueLoading
        },
        created () {
            this.getGroup()
        },
        data() {
            return {
                group: {
                    name: ''
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            getGroup () {
                this.$http.get(`groups/${ this.$route.params.id }`).then( response => {
                    this.group = response.data
                })
            },
            save () {
                this.saving = true
                this.$http.put(`groups/${ this.$route.params.id }`, this.group).then( response => {
                    this.$toastr.success('Grupo actualizado')
                    this.$router.push({ name: 'groups.index' })
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