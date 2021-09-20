<template>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        Empresa - parámetros
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="save">
                            <div class="alert alert-danger" v-show="Object.keys(errors).length > 0 ? true : false">
                                <li v-for="(error, index) in errors" :key="index">
                                    {{ error[0] }}
                                </li>
                            </div>
                            <div class="form-group">
                                <label for="">Logo</label>
                                <croppa
                                    v-model="myCroppa"
                                    :placeholder-font-size="14"
                                    placeholder="Seleccione imagen"
                                    :prevent-white-space="true"
                                    >
                                </croppa>
                            </div>
                            <div class="form-group">
                                <label for="">Motivo de servicio para mantenimientos preventivos</label>
                                <textarea rows="4" class="form-control" maxlength="500" v-model="company.reason_preventive_maintenance_report_digital"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="">Complemento título</label>
                                <input type="text" class="form-control" v-model="company.complementTitle" maxlength="15">
                            </div>
                            <vue-loading v-if="saving" type="spin" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>    
                            <div v-else>
                                <button class="btn btn-primary btn-sm mr-1" :disabled="!hasPermission('company.update')">
                                    <i class="fa fa-save"></i> Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import hasPermission from '../_utilities/hasPermission'
    import { VueLoading } from 'vue-loading-template'
    export default {
        name: 'elements.create',
        components: {
            VueLoading
        },
        created () {
            this.getCompanyParameters()
        },
        mixins: [hasPermission],
        data() {
            return {
                myCroppa: {},
                company: {
                    logo: '',
                    reason_preventive_maintenance_report_digital: '',
                    complementTitle: '',
                },
                saving: false,
                errors: {}
            }
        },
        methods: {
            getCompanyParameters () {
                this.$http.get(`company`).then( response => {
                    this.company = response.data
                })
            },
            save () {
                this.saving = true
                this.myCroppa.generateBlob((blob) => {
                    let data = new FormData
                    if (blob) {
                        data.append('logo', blob)
                    }

                    data.append('reason_preventive_maintenance_report_digital', this.company.reason_preventive_maintenance_report_digital)
                    data.append('complementTitle', this.company.complementTitle ? this.company.complementTitle : '');
                    
                    this.$http.post(`company`, data).then( response => {
                        this.$toastr.success('Datos actualizados')
                        this.saving = false
                        this.errors = {}
                        this.myCroppa.remove()
                    }).catch(error => {
                        this.saving = false
                        if (error.response.status == 422) {
                            this.errors = error.response.data.errors
                        }
                    })
                    
                }, 'image/jpeg', 0.8) // 80% compressed jpeg file

            }
        },
    }
</script>

<style lang="scss" scoped>

</style>