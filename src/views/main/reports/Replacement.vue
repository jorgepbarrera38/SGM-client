<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Repuestos usados
                        </span>
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="loading = true; getReplacements()">
                            <div class="form-row">
                                <div class="form-group col-md-3">
                                    <label for="">Fecha inicial</label>
                                    <input type="date" class="form-control" v-model="parameters.initial_date" required>
                                </div>
                                <div class="form-group col-md-3">
                                    <label for="">Fecha final</label>
                                    <input type="date" class="form-control" v-model="parameters.final_date" required>
                                </div>
                                <div class="form-group col-md-1">
                                    <label for="" style="opacity:0">ALEXIS</label> <br>
                                    <button type="submit" class="btn btn-primary btn-block">
                                        <i class="fa fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <vue-loading v-if="loading" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
            <div class="col-md-12 mt-3" v-if="!loading && Object.keys(replacements.data).length > 0">
                <div class="card">
                    <div class="card-header">
                        Resultados
                        <div class="float-right">
                            <button class="btn btn-success btn-sm mr-1" @click="exportReportExcel">
                                <div class="spinner-border spinner-border-sm" role="status" v-if="downloadingExcel">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <i class="fa fa-file-excel" v-else></i>
                                Exportar
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover table-sm">
                                <thead>
                                    <th>Fecha</th>
                                    <th>Repuesto</th>
                                    <th>Cantidad</th>
                                    <th>Tipo</th>
                                    <th>Usuario</th>
                                    <th></th>
                                </thead>
                                <tbody>
                                    <tr v-for="replacement in replacements.data" :key="replacement.id">
                                        <td nowrap>{{ convertDate(replacement.replacement_maintenancable.date_of_realization) }}</td>
                                        <td nowrap>{{ replacement.replacement.name }}</td>
                                        <td nowrap>{{ replacement.quantity }}</td>
                                        <td nowrap>
                                            <span v-if="!replacement.replacement_maintenancable.device">
                                                Mantenimiento general
                                            </span>
                                            <span v-else>
                                                {{ replacement.replacement_maintenancable_type.includes('OtherMaintenance') ? 'Otro mantenimiento' : 'Mantenimiento preventivo' }}
                                            </span>
                                        </td>
                                        <td nowrap>{{ replacement.replacement_maintenancable.user.names }}</td>
                                        <td nowrap>
                                            <button class="btn btn-primary btn-sm mr-1" title="Evidencia" 
                                                @click="showEvidence(replacement.replacement_maintenancable.evidence)">
                                                <i class="fa fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <pagination :data="replacements" @pagination-change-page="getReplacements"></pagination>
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
    import ModalFullHeight from '../components/ModalFullHeight'
    import download from 'downloadjs'
    export default {
        name: 'reports.replacements.index',
        components: {
            VueLoading, 'modal-full-height': ModalFullHeight
        },
        created () {
            //this.getReplacements()
        },
        data() {
            return {
                parameters: {
                    initial_date: '',
                    final_date: ''
                },
                initial_date_selected: '',
                final_date_selected: '',
                replacements: { data: [] },
                loading: false,
                evidence: '',
                downloadingExcel: false
            }
        },
        methods: {
            getReplacements (page = 1) {

                this.initial_date_selected = this.parameters.initial_date
                this.final_date_selected = this.parameters.final_date

                this.$http.get(`reports/replacements-used?page=${ page }&initial_date=${ this.initial_date_selected }&final_date=${ this.final_date_selected }`).then( response => {
                    this.replacements = response.data
                    if (response.data && response.data.data.length < 1) {
                        this.$toastr.info('No hay registros')
                    }
                    this.loading = false
                })
            },
            showEvidence (evidence) {
                this.evidence = `${this.$serverFiles}/${ evidence }`
                $('#modalFullHeight').modal('show')
            },
            exportReportExcel () {
                this.downloadingExcel = true
                this.$http.get(`reports/replacements-used-excel?initial_date=${ this.initial_date_selected }&final_date=${ this.final_date_selected }`, { responseType: 'blob' })
                    .then( response => {
                    download(response.data, "Reporte-de-repuestos-usados.xlsx", "blob");
                    this.downloadingExcel = false
                    this.$toastr.success('Reporte excel descargado')
                }).catch(() => {
                    this.downloadingExcel = false
                    this.$toastr.error('Error al descargar el reporte')
                })
            },
            convertDate (date) {
                return this.$moment(date).format('DD[-]MMMM[-]Y')
            }
        },
    }
</script>