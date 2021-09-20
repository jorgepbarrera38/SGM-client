<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Tipos de elementos
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('elements.create')"
                            @click="$router.push({ name: 'elements.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchElement" placeholder="Nombre del elemento"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="element in elements.data" :key="element.id">
                                        <td>{{ element.name }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('elements.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'elements.edit', params: { id: element.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteElement(element.id)" :disabled="!hasPermission('elements.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="elements" @pagination-change-page="getElements"></pagination>
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
        name: 'elements.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        mixins: [ hasPermission ],
        created () {
            this.getElements()
        },
        data() {
            return {
                elements: {},
                loading: true
            }
        },
        methods: {
            searchElement (search) {
                this.loading = true
                this.getElements(1, search.search)
            },
            getElements (page = 1, search = '') {
                this.$http.get(`elements?page=${ page }&name=${ search }`).then( response => {
                    this.elements = response.data
                    this.loading = false
                })
            },
            deleteElement (element) {
                this.$http.delete(`elements/${ element }`).then( response => {
                    this.getElements()
                    this.$toastr.success('Elemento eliminado')
                }).catch(() => {
                    this.$toastr.error('El elemento no se pudo eliminar')
                })
            }
        },
    }
</script>