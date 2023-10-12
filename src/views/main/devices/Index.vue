<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="card-title">
                            Dispositivos
                        </span>
                        <button class="btn btn-success btn-sm float-right" :disabled="!hasPermission('devices.create')"
                            @click="$router.push({ name: 'devices.create' })">
                            <i class="fa fa-plus"></i> Nuevo
                        </button>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchDevice"
                            :groups="groups" 
                            @showFilters="showOrHideFilters" 
                            :showButtonFromFilter="true" 
                            :showButtonForSelectGroup="true"
                            placeholder="Placa o serial"/>

                        <form class="form-row" v-if="showFilters">
                            <div class="form-group col-md-3">
                                <label for="">Elemento</label>
                                <select class="form-control" v-model="element">
                                    <option value="">Todos</option>
                                    <option :value="element.id" v-for="element in elements" :key="`element-${ element.id }`">
                                        {{ element.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-3">
                                <label for="">Ubicación</label>
                                <select class="form-control" v-model="location">
                                    <option value="">Todos</option>
                                    <option :value="location.id" v-for="location in locations" :key="`location-${ location.id }`">
                                        {{ location.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-3">
                                <label for="">Dependencia</label>
                                <select class="form-control" v-model="dependence">
                                    <option value="">Todos</option>
                                    <option :value="dependence.id" v-for="dependence in dependences" :key="`dependence-${ dependence.id }`">
                                        {{ dependence.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group col-md-3">
                                <label for="">Responsable</label>
                                <select class="form-control" v-model="responsible">
                                    <option value="">Todos</option>
                                    <option :value="responsible.id" v-for="responsible in responsibles" :key="`responsible-${ responsible.id }`">
                                        {{ responsible.fullnames }}
                                    </option>
                                </select>
                            </div>
                        </form>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Foto</th>
                                    <th>H.V</th>
                                    <th>Grupo</th>
                                    <th>Elemento</th>
                                    <th>Placa</th>
                                    <th>Serial</th>
                                    <th>Ubicación</th>
                                    <th>Dependencia</th>
                                    <th>Responsable</th>
                                    <th nowrap>Última actualización</th>
                                </thead>
                                <tbody>
                                    <tr v-for="device in devices.data" :key="device.id" 
                                            @click="hasPermission('devices.show') ? $router.push({ name: 'devices.show', params: { id: device.id } }) : ''"
                                            style="cursor:pointer"
                                            :title="`\rDESCRIPCIÓN:\n${ device.description } \n\nOBSERVACIÓNES:\n${ device.observations ? device.observations : '' }`">
                                        <td>
                                            <img 
                                                :src="device.photographic_records[0] ? `${ $serverFiles }${ device.photographic_records[0].photo }` : 'https://pngimage.net/wp-content/uploads/2018/06/img-icon-png-3.png'" 
                                                alt="" class="rounded-circle" width="35">

                                        </td>
                                        <td nowrap>{{ device.resume_number }}</td>
                                        <td nowrap>{{ device.group.name }}</td>
                                        <td nowrap>{{ device.element.name }}</td>
                                        <td nowrap>{{ device.internal_code }}</td>
                                        <td nowrap>{{ device.serial_number }}</td>
                                        <td nowrap>{{ device.location.name }}</td>
                                        <td nowrap>{{ device.dependence.name }}</td>
                                        <td nowrap>{{ device.responsible.fullnames }}</td>
                                        <td nowrap>{{ moment(device.updated_at) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :limit="3" align="center" :data="devices" @pagination-change-page="getDevices"></pagination>
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
    import moment from 'moment'
    export default {
        name: 'devices.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch
        },
        created () {
            this.getDevices()
        },
        mixins: [ hasPermission ],
        data() {
            return {
                devices: {},
                getFilters: true,
                groups: [],
                elements: [],
                locations: [],
                dependences: [],
                responsibles: [],
                group: '',
                element: localStorage.getItem('elementSearch') ? JSON.parse(localStorage.getItem('elementSearch')) : '',
                location: localStorage.getItem('locationSearch') ? JSON.parse(localStorage.getItem('locationSearch')) : '',
                dependence: localStorage.getItem('dependenceSearch') ? JSON.parse(localStorage.getItem('dependenceSearch')) : '',
                responsible: localStorage.getItem('responsibleSearch') ? JSON.parse(localStorage.getItem('responsibleSearch')) : '',
                showFilters: localStorage.getItem('showFiltersToSearchDevices') ? JSON.parse(localStorage.getItem('showFiltersToSearchDevices')) : false,
                loading: true,
                errors: {}
            }
        },
        methods: {
            searchDevice (paramsSearch) {
                this.loading = true
                this.group = paramsSearch.group_id
                this.getDevices(1, paramsSearch.search)
                localStorage.setItem('locationSearch', JSON.stringify(this.location))
                localStorage.setItem('dependenceSearch', JSON.stringify(this.dependence))
                localStorage.setItem('responsibleSearch', JSON.stringify(this.responsible))
            },
            getDevices (page, search = '') {

                let pageFinal

                if (page) {
                    pageFinal = page
                    localStorage.setItem('page', JSON.stringify(page))
                } else {
                    pageFinal = localStorage.getItem('page', JSON.stringify(page))
                }

                this.$http.get(`devices?page=${ pageFinal }&internal-code-or-serial=${ search }&group=${ this.group }&element=${ this.element }&location=${ this.location }&dependence=${ this.dependence }&responsible=${ this.responsible }&get-filters=${ this.getFilters }`).then( response => {
                    this.devices = {}
                    if (this.getFilters) {
                        this.devices = response.data.devices
                        this.groups = response.data.groups
                        this.elements = response.data.elements
                        this.locations = response.data.locations
                        this.dependences = response.data.dependences
                        this.responsibles = response.data.responsibles
                        this.getFilters = false
                        //this.group = response.data.groups[0].id
                    } else {
                        this.devices = response.data
                    }
                    this.loading = false
                }).catch(error => {
                    this.loading = false
                    if (error.response.status == 422) {
                        this.$toastr.error(error.response.data.message);
                        //this.errors = error.response.data.errors
                    }
                })
            },
            showOrHideFilters () {
                this.showFilters = !this.showFilters
                localStorage.setItem('showFiltersToSearchDevices', JSON.stringify(this.showFilters))
            },
            moment (date) {
                return date ? moment(date).format('LLL') : ''
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>