<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Dispositivos dados de baja
                        </span>
                    </div>
                    <div class="card-body">
                        <!--Buscador-->
                        <simple-search @searching="searchElement" placeholder="Placa o serial"/>
                        <!--Fin buscador-->
                        <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div class="table-responsive" v-else style="margin-top:15px">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>H.V</th>
                                    <th>Elemento</th>
                                    <th>Placa</th>
                                    <th>Serial</th>
                                    <th>Fecha</th>
                                    <th>Usuario</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="deviceInDown in devicesInDown.data" :key="deviceInDown.id"
                                        :title="`\rDESCRIPCIÓN:\n ${ deviceInDown.description } \n\nOBSERVACIÓNES:\n ${ deviceInDown.observations ? deviceInDown.observations : '' }`">
                                        <td nowrap>{{ deviceInDown.id }}</td>
                                        <td nowrap>{{ deviceInDown.element.name }}</td>
                                        <td nowrap>{{ deviceInDown.internal_code }}</td>
                                        <td nowrap>{{ deviceInDown.serial_number }}</td>
                                        <td nowrap>{{ deviceInDown.down_date }}</td>
                                        <td nowrap>{{ deviceInDown.down_user.names }}</td>
                                        <td nowrap>
                                            <button class="btn btn-primary btn-sm mr-1"
                                                @click="showEvidence(deviceInDown.down_evidence)">
                                                <i class="fa fa-eye"></i> Evidencia
                                            </button>
                                            <router-link :to="{ name: 'devices.show', params: { id: deviceInDown.id } }" 
                                                class="btn btn-secondary btn-sm">
                                                <i class="fa fa-info"></i> Info
                                            </router-link>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="devicesInDown" @pagination-change-page="getDevicesInDown"></pagination>
                        <!-- Modal evidence -->
                        <modal-full-height :evidence="evidence" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    import SimpleSearch from '../components/SimpleSearch'
    import ModalFullHeight from '../components/ModalFullHeight'
    export default {
        name: 'elements.index',
        components: {
            VueLoading, 'simple-search': SimpleSearch, 'modal-full-height': ModalFullHeight
        },
        created () {
            this.getDevicesInDown()
        },
        data() {
            return {
                devicesInDown: {},
                evidence: '',
                loading: true
            }
        },
        methods: {
            searchElement (search) {
                this.loading = true
                this.getDevicesInDown(1, search.search)
            },
            getDevicesInDown (page = 1, search = '') {
                this.$http.get(`down-devices?page=${ page }&code-or-serial=${ search }`).then( response => {
                    this.devicesInDown = response.data
                    this.loading = false
                })
            },
            showEvidence (evidence) {
                this.evidence = `${this.$serverFiles}${ evidence }`
                $('#modalFullHeight').modal('show')
            }
        },
    }
</script>