<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Repuestos y consumibles
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('replacements.create')"
                            @click="$router.push({ name: 'replacements.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchReplacement" placeholder="Nombre del repuesto"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="replacement in replacements.data" :key="replacement.id">
                                        <td>{{ replacement.name }}</td>
                                        <td>${{ replacement.price | convertMoney }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('replacements.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'replacements.edit', params: { id: replacement.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteElement(element.id)" :disabled="!hasPermission('replacements.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="replacements" @pagination-change-page="getReplacements"></pagination>
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
        name: 'replacements.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getReplacements()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                replacements: {},
                loading: true
            }
        },
        methods: {
            searchReplacement (search) {
                this.loading = true
                this.getReplacements(1, search.search)
            },
            getReplacements (page = 1, search = '') {
                this.$http.get(`replacements?page=${ page }&name=${ search }`).then( response => {
                    this.replacements = response.data
                    console.log(response.data);
                    this.loading = false
                })
            },
            deleteReplacement (replacement) {
                this.$http.delete(`replacements/${ replacement }`).then( response => {
                    this.getReplacements()
                    this.$toastr.success('Registro eliminado')
                })
            }
        },
    }
</script>