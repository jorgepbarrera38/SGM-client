<template>
    <div>
      <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <span class="panel-title">
                            Permisos de {{ user.names }}
                        </span>
                        <router-link class="btn btn-success btn-sm float-right" :to="{ name: 'users.create' }"><i class="fa fa-plus"></i> Nuevo</router-link>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-danger" v-if="errors">
                          <li v-for="(error, index) in errors" :key="index">
                            {{ error[0] }}
                          </li>
                        </div>
                        <div style="max-height:370px;overflow:auto">
                          <div class="table-responsive">
                            <table class="table table-sm table-hover">
                              <thead>
                                <th>Permiso</th>
                                <th nowrap>
                                  <button class="btn btn-default btn-sm" type="button" @click="selectAll">
                                    Todos
                                  </button>
                                  <button class="btn btn-default btn-sm" type="button" @click="unSelectAll">
                                    Ninguno
                                  </button>
                                </th>
                              </thead>
                              <tbody>
                                <tr v-for="permission in permissions" :key="permission.id">
                                  <td>{{ permission.description }}</td>
                                  <td>
                                    <input type="checkbox" :value="permission" v-model="user.permissions">
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <vue-loading v-if="loading" type="spiningDubbles" color="#d9544e" :size="{ width: '50px', height: '50px' }"></vue-loading>
                        <div v-else>
                          <button class="btn btn-primary btn-sm" @click="savePermissions">
                            <i class="fa fa-save"></i> Actualizar
                          </button>
                          &nbsp;&nbsp;&nbsp;
                          <router-link :to="{ name: 'users.index' }" class="btn btn-danger  btn-sm">
                            <i class="fa fa-undo"></i> Cancelar
                          </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
    import { VueLoading } from 'vue-loading-template'
    export default {
        components: {
          VueLoading
        },
        created () {
          this.getUserWithPermissions()
        },
        data() {
            return {
                user: {
                  names: '',
                  surnames: '',
                  permission: []
                },
                permissions: [],
                errors: null,
                loading: true,
            }
        },
        methods: {
          getUserWithPermissions () {
            this.$http.get(`users/${ this.$route.params.id }/get-permissions`).then( response => {
              this.user = response.data.user
              this.user.permissions = response.data.user.permissions.map(permission => {
                return {
                  created_at: permission.created_at,
                  description: permission.description,
                  id: permission.id,
                  name: permission.name,
                  updated_at: permission.updated_at,
                }
              })
              this.permissions = response.data.permissions
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          },
          savePermissions () {
            this.loading = true
            this.$http.put(`users/${ this.$route.params.id }/update-permissions`, this.user.permissions).then( response => {
              this.$toastr.success('Permisos actualizados')
              this.loading = false
            }).catch(() => {
              this.loading = false
            })
          },
          selectAll () {
            this.user.permissions.push(...this.permissions)
          },
          unSelectAll () {
            this.user.permissions.splice(0)
          }
        }
    }
</script>