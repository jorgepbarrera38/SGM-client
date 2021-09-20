<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Anexar documento
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save">
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                <li v-for="(error, index) in errors" :key="index">
                                    {{ error[0] }}
                                </li>
                            </div>
                            <div class="form-group">
                                <label for="">Tipo de documento</label>
                                <select class="form-control" v-model="document.type_document_id">
                                    <option value="">Seleccione tipo de documento</option>
                                    <option :value="typeDocument.id" v-for="typeDocument in typeDocuments" :key="`typeDocument-${ typeDocument.id }`">
                                        {{ typeDocument.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="">Documento</label>
                                <input type="file" id="file" class="form-control" @change="setFileInModel">
                            </div>
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button type="submit" class="btn btn-primary btn-sm mr-1"><i class="fa fa-save"></i> Guardar</button>
                                <a href="#" class="btn btn-danger btn-sm" @click.prevent="$router.go(-1)"><i class="fa fa-times-circle"></i> Cancelar</a>
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
        name: 'devices.movements.create',
        components: {
            VueLoading
        },
        created () {
            this.getDataToCreateDocument()
        },
        data() {
            return {
                document: {
                    type_document_id: '',
                    file: ''
                },
                typeDocuments: [],
                errors: {},
                saving: false
            }
        },
        methods: {
            getDataToCreateDocument() {
                this.$http.get(`documents/get-data-to-create-document`).then( response => {
                   this.typeDocuments = response.data
                })
            },
            save () {
                this.saving = true

                let data = new FormData
                data.append('type_document_id', this.document.type_document_id)
                data.append('file', this.document.file)

                this.$http.post(`documents/${ this.$route.params.id }`, data).then( () => {
                    this.saving = false
                    this.$toastr.success('El documento se anexó')
                    this.document = {
                        type_document_id: '',
                        file: ''
                    }
                    this.errors = {}
                }).catch(error => {
                    this.saving = false
                    if (error.response.status == 422) {
                        this.errors = error.response.data.errors
                    }
                })
            },
            setFileInModel (e) {
                this.document.file = e.target.files[0]
            }
        },
    }
</script>