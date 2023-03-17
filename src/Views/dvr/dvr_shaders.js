const volume_vert_shader = "" +
    "layout(location = 0) in vec3 position;\n" +
    "uniform mat4 projection;\n" +
    "out vec3 world_pos;\n" +
    "void main()  {\n" +
    "\tvec4 affine_cube = vec4(position.x,position.y,position.z,1.0);\n" +
    "\tvec4 pix_cube = projection*affine_cube;\n" +
    "\n" +
    "\tworld_pos = affine_cube.xyz;\n" +
    "\tgl_Position = pix_cube;\n" +
    "}\n"
const volume_frag_shader = "" +
    "in vec3 world_pos;\n" +
    "out vec4 frag_color;\n" +
    "\n" +
    "uniform vec3 camera_pos;\n" +
    "uniform vec3 min_bb;\n" +
    "uniform vec3 max_bb;\n" +
    "\n" +
    "uniform sampler3D volume;\n" +
    "uniform sampler3D normal_map;\n" +
    "uniform sampler1D tf;\n" +
    "\n" +
    "uniform vec3 light_dir;\n" +
    "uniform float step_size = 0.02;\n" +
    "uniform float min_v = 0;\n" +
    "uniform float max_v = 1;\n" +
    "\n" +
    "void main()  {\n" +
    "    vec3 ray_dir = normalize(world_pos-camera_pos);\n" +
    "    vec3 inv_ray_dir = 1.0/ray_dir;\n" +
    "\n" +
    "    vec3 t_mins = (min_bb-camera_pos)*inv_ray_dir;\n" +
    "    vec3 t_maxs = (max_bb-camera_pos)*inv_ray_dir;\n" +
    "    vec3 tmin = min(t_mins, t_maxs);\n" +
    "    vec3 tmax = max(t_mins, t_maxs);\n" +
    "    vec2 t = max(tmin.xx, tmin.yz);\n" +
    "    float t_enter = max(t.x, t.y);\n" +
    "    t = min(tmax.xx, tmax.yz);\n" +
    "    float t_exit = min(t.x, t.y);\n" +
    "\n" +
    "    vec3 out_pt = camera_pos+t_exit*ray_dir;\n" +
    "\n" +
    "    int n_steps = int(ceil((t_exit-t_enter)/step_size));\n" +
    "\n" +
    "    vec4 vr_color = vec4(0.0, 0.0, 0.0, 0.0);\n" +
    "    float cur_t = t_enter;\n" +
    "    for (int i = 0; i < n_steps; i++)  {\n" +
    "        cur_t += step_size;\n" +
    "        vec3 tex_coord = camera_pos+cur_t*ray_dir;\n" +
    "        tex_coord = (tex_coord-min_bb)/(max_bb-min_bb);\n" +
    "        float sf = texture(volume, tex_coord).x;\n" +
    "        vec3 normal = normalize(texture(normal_map, tex_coord).xyz);\n" +
    "        float diffuse = min(max(dot(normal, light_dir), dot(-normal, light_dir)), 1.f);\n" +
    "        sf = (sf-min_v)/(max_v - min_v);\n" +
    "        vec4 tf_val = texture(tf, sf);\n" +
    "        vec3 step_color = (1.0-vr_color.a)*tf_val.rgb*diffuse*tf_val.a;\n" +
    "        vr_color.rgb += step_color;\n" +
    "        vr_color.a += (1.0-vr_color.a)*tf_val.a;\n" +
    "    }\n" +
    "\n" +
    "    frag_color = vr_color;\n" +
    "}"

export {volume_vert_shader, volume_frag_shader}