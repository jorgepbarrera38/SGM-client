<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Editar usuario
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save">
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                <li v-for="(error, index) in errors" :key="index">
                                    {{ error[0] }}
                                </li>
                            </div>
                            <div class="form-group">
                                <label for="">Nombres (*)</label>
                                <input type="text" class="form-control" v-model="user.names" maxlength="70">
                            </div>
                            <div class="form-group">
                                <label for="">Nombre de usuario (*)</label>
                                <input type="text" class="form-control" v-model="user.username" maxlength="20">
                            </div>
                            <div class="form-group">
                                <label for="">Contraseña (Dejar vacío si no se desea cambiar)</label>
                                <input type="text" class="form-control" v-model="user.newPassword" maxlength="20">
                            </div>
                            <div class="form-group">
                                <label for="">Cargo (*)</label>
                                <input type="text" class="form-control" v-model="user.official_position" maxlength="30">
                            </div>
                            <div class="form-group">
                                <input type="checkbox" v-model="user.technical_support"> Soporte técnico
                            </div>
                            <div class="form-group">
                                <label for="">Firma</label>
                                <croppa
                                    v-model="myCroppa"
                                    :placeholder-font-size="14"
                                    placeholder="Seleccione imagen"
                                    :prevent-white-space="true"
                                    :width="400"
                                    :height="150"
                                    >
                                </croppa>
                            </div>
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                <router-link class="btn btn-danger btn-sm" :to="{ name: 'users.index' }"><i class="fa fa-times-circle"></i> Cancelar</router-link>
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
        name: 'users.edit',
        components: {
            VueLoading
        },
        created () {
            this.getUser()
        },
        data() {
            return {
                user: {
                    names: '',
                    username: '',
                    newPassword: '',
                    official_position: '',
                    technical_support: false
                },
                myCroppa: {},
                saving: false,
                errors: {}
            }
        },
        methods: {
            getUser () {
                this.$http.get(`users/${ this.$route.params.id }`).then( response => {
                    this.user = response.data
                })
            },
            save () {
                this.saving = true
                this.myCroppa.generateBlob((blob) => {

                    let data = new FormData
                    data.append('names', this.user.names)
                    data.append('username', this.user.username)
                    if (this.user.newPassword) {
                        data.append('password', this.user.newPassword)
                    }
                    data.append('official_position', this.user.official_position)
                    data.append('technical_support', this.user.technical_support ? 1 : 0 )
                    
                    if (blob) {
                        data.append('signature', blob)
                    }
                    
                    data.append('_method', 'put')

                    this.$http.post(`users/${ this.$route.params.id }`, data).then( response => {
                        this.$toastr.success('Usuario actualizado')
                        this.$router.push({ name: 'users.index' })
                    }).catch(error => {
                        this.saving = false
                        if (error.response.status == 422) {
                            this.errors = error.response.data.errors
                        }
                    })
                })
                
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>