<template>
    <div class="container">
        <div class="row">
            <div class="col-md-3 offset-md-4">
                <div class="card">
                    <div class="card-header">
                        Actualizar foto
                    </div>
                    <div class="card-body">
                        <div class="alert alert-danger" v-if="errors">
                            <li v-for="(error, index) in errors" :key="index">
                                {{ error[0] }}
                            </li>
                        </div>
                        <croppa
                            v-model="myCroppa"
                            :placeholder-font-size="14"
                            placeholder="Seleccione imagen"
                            :prevent-white-space="true"
                            >
                        </croppa>
                        <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                        <div v-else>
                            <button class="btn btn-primary btn-sm mr-1" @click="save"><i class="fa fa-save"></i> Guardar</button>
                            <a href="#" class="btn btn-danger btn-sm" @click="$router.go(-1)"><i class="fa fa-times-circle"></i> Cancelar</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    export default {
        name: 'devices.updatePhoto',
        components: {
            VueLoading
        },
        data() {
            return {
                myCroppa: {},
                saving: false,
                errors: null
            }
        },
        methods: {
            save () {
                this.saving = true
                this.myCroppa.generateBlob((blob) => {
                    let data = new FormData
                    data.append('photo', blob)
                    
                    this.$http.post(`devices/${ this.$route.params.id }`, data).then( response => {
                        this.$toastr.success('Foto actualizada')
                        this.$router.go(-1)
                    }).catch(error => {
                        this.saving = false
                        if (error.response.status == 422) {
                            this.errors = error.response.data.errors
                        }
                    })
                    
                }, 'image/jpeg', 0.8) // 80% compressed jpeg file

            }
        },
    }
</script>