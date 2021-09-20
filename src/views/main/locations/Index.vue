<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Ubicaciónes
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('locations.create')"
                            @click="$router.push({ name: 'locations.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchLocation" placeholder="Nombre de la ubicación"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Nombre</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="location in locations.data" :key="location.id">
                                        <td>{{ location.name }}</td>
                                        <th>
                                            <button class="btn btn-warning btn-sm" :disabled="!hasPermission('locations.edit')" style="margin-right:3px"
                                                @click="$router.push({ name: 'locations.edit', params: { id: location.id } })">
                                                <i class="fa fa-edit"></i> Editar
                                            </button>

                                            <button class="btn btn-danger btn-sm mr-1" @click="deleteLocation(location.id)" :disabled="!hasPermission('locations.destroy')">
                                                <i class="fa fa-trash-alt"></i> Eliminar
                                            </button>
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="locations" @pagination-change-page="getLocations"></pagination>
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
        name: 'locations.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        mixins: [ hasPermission ],
        created () {
            this.getLocations()
        },
        data() {
            return {
                locations: {},
                loading: true
            }
        },
        methods: {
            searchLocation (search) {
                this.loading = true
                this.getLocations(1, search.search)
            },
            getLocations (page = 1, search = '') {
                this.$http.get(`locations?page=${ page }&name=${ search }`).then( response => {
                    this.locations = response.data
                    this.loading = false
                })
            },
            deleteLocation (location) {
                this.$http.delete(`locations/${ location }`).then( response => {
                    this.getLocations()
                    this.$toastr.success('Ubicación eliminada')
                }).catch(() => {
                    this.$toastr.error('La ubicación no se pudo eliminar')
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>