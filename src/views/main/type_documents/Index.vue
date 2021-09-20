<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Tipos de documentos
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('type-documents.create')"
                            @click="$router.push({ name: 'typeDocuments.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchTypeDocument" placeholder="Nombre"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="typeDocument in typeDocuments.data" :key="typeDocument.id">
                                        <td>{{ typeDocument.name }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('type-documents.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'typeDocuments.edit', params: { id: typeDocument.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteTypeDocument(typeDocument.id)" :disabled="!hasPermission('type-documents.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="typeDocuments" @pagination-change-page="getTypeDocuments"></pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    import SimpleSearch from '../components/SimpleSearch'
    export default {
        name: 'typeDocuments.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getTypeDocuments()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                typeDocuments: {},
                loading: true
            }
        },
        methods: {
            searchTypeDocument (search) {
                this.loading = true
                this.getTypeDocuments(1, search.search)
            },
            getTypeDocuments (page = 1, search = '') {
                this.$http.get(`type-documents?page=${ page }&name=${ search }`).then( response => {
                    this.typeDocuments = response.data
                    this.loading = false
                })
            },
            deleteTypeDocument (typeDocument) {
                this.$http.delete(`type-documents/${ typeDocument }`).then( response => {
                    this.getTypeDocuments()
                    this.$toastr.success('Tipo de documento eliminado')
                }).catch(() => {
                    this.$toastr.error('El tipo de documento no se pudo eliminar')
                })
            }
        },
    }
</script>