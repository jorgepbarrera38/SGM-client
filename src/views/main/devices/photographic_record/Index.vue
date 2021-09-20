<template>
    <div class="container">
        <div class="row">
            <div class="col-md-3 mb-3">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Subir imagen
                        </span>
                        <div class=" float-right">
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label class="btn btn-secondary btn-sm" @click="$router.back()">
                                    <input type="radio" name="options" id="option2" autocomplete="off"> <i class="fa fa-undo"></i> Atrás
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <croppa
                            v-model="myCroppa"
                            :placeholder-font-size="14"
                            placeholder="Seleccione imagen"
                            :prevent-white-space="true"
                            >
                        </croppa>
                        <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <button class="btn btn-primary btn-sm" @click="save" v-else>
                            <i class="fa fa-upload"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Registro fotográfico
                        </span>
                    </div>
                    <div class="card-body">
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th>Principal</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="photo in photos" :key="photo.id">
                                        <td>
                                            <img class="img-fluid" :src="`${$serverFiles}/${photo.photo}`" width="40">
                                        </td>
                                        <td>
                                            <i class="fa fa-check" v-if="photo.principal"></i>
                                            <button v-else @click="selectAsPrincipal(photo)"
                                                class="btn btn-success btn-sm">
                                                <i class="fa fa-hand-pointer"></i>
                                                seleccionar
                                            </button>
                                        </td>
                                        <th>
                                            <button class="btn btn-danger btn-sm" @click="deletePhoto(photo.id)"><i class="fa fa-trash-alt"></i> Eliminar</button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
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
        name: 'photographic-record.index',
        components: {
            VueLoading
        },
        created () {
            this.getPhotos()
        },
        data() {
            return {
                photos: [],
                loading: true,
                saving: false,
                myCroppa: {},
                errors: []
            }
        },
        methods: {
            getPhotos () {
                this.$http.get(`devices/${ this.$route.params.id }/get-photographic-record`).then( response => {
                    this.photos = response.data
                    this.loading = false
                })
            },
            deletePhoto (photo) {
                this.$http.delete(`devices/${ photo }/delete-photographic-record`).then( response => {
                    this.getPhotos()
                    this.$toastr.success('Imagen eliminada')
                }).catch(() => {
                    this.$toastr.error('El elemento no se pudo eliminar')
                })
            },
            save () {
                this.saving = true
                this.myCroppa.generateBlob((blob) => {
                    let data = new FormData
                    data.append('photo', blob)
                    
                    this.$http.post(`devices/${ this.$route.params.id }/upload-photographic-record`, data).then( response => {
                        this.getPhotos()
                        this.saving = false
                        this.$toastr.success('Imagen subida')
                        this.myCroppa.remove()
                    }).catch(error => {
                        this.saving = false
                        if (error.response.status == 422) {
                            this.$toastr.error(error.response.data.errors.photo[0]);
                            this.errors = error.response.data.errors
                        }
                    })
                    
                }, 'image/jpeg', 0.8) // 80% compressed jpeg file

            },
            selectAsPrincipal (photo) {
                
                let findPhotoPrincipal = this.photos.find(photo => photo.principal)
                findPhotoPrincipal ? findPhotoPrincipal.principal = false : ''

                photo.principal = true

                this.$http.post(`devices/${ photo.id }/select-as-principal`).then( response => {
                    console.log(response.data);
                    this.getPhotos()
                })   
            }
        },
    }
</script>