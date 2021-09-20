<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Marcas
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('brands.create')"
                            @click="$router.push({ name: 'brands.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchBrand" placeholder="Nombre de la marca"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="brand in brands.data" :key="brand.id">
                                        <td>{{ brand.name }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('brands.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'brands.edit', params: { id: brand.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteBrand(brand.id)" :disabled="!hasPermission('brands.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="brands" @pagination-change-page="getBrands"></pagination>
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
        name: 'brands.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getBrands()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                brands: {},
                loading: true
            }
        },
        methods: {
            searchBrand (search) {
                this.loading = true
                this.getBrands(1, search.search)
            },
            getBrands (page = 1, search = '') {
                this.$http.get(`brands?page=${ page }&name=${ search }`).then( response => {
                    this.brands = response.data
                    this.loading = false
                })
            },
            deleteBrand (brand) {
                this.$http.delete(`brands/${ brand }`).then( response => {
                    this.getBrands()
                    this.$toastr.success('Marca eliminada')
                }).catch(() => {
                    this.$toastr.error('La marca no se pudo eliminar')
                })
            }
        },
    }
</script>