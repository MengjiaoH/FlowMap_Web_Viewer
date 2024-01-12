const point_vert_shader = `
precision highp float;
precision highp int;
precision highp sampler2D;

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
in mat4 instanceMatrix;
in vec3 instanceColor;
out vec3 v_color;
out vec3 world_pos;
out vec3 v_norm;
void main()  {
    vec4 affine_pos = instanceMatrix * vec4(position.x,position.y,position.z,1.0);
    vec4 mv_pos =  modelViewMatrix * affine_pos;
    vec4 mvp_pos = projectionMatrix * mv_pos;
    
    v_norm = mat3(instanceMatrix) * mat3(modelMatrix) * normal;
    
    world_pos = affine_pos.xyz;
    gl_Position = mvp_pos;
    v_color = instanceColor;
}
`
const point_frag_shader = `
precision highp float;
precision highp int;
precision mediump sampler2D;
precision mediump sampler3D;

in vec3 world_pos;
out vec4 frag_color;

uniform vec3 camera_pos;
uniform vec3 min_bb;
uniform vec3 max_bb;

uniform sampler3D volume;
uniform sampler3D normal_map;
uniform sampler2D tf;

uniform vec3 light_dir;
uniform float step_size;
uniform float min_v;
uniform float max_v;

in vec3 v_color;
in vec3 v_norm;

void main()  {
    vec3 ray_dir = normalize(world_pos-camera_pos);
    vec3 inv_ray_dir = 1.0/ray_dir;
    vec3 light = normalize(light_dir-world_pos);
    
    float diffuse = min(max(dot(v_norm, light), dot(-v_norm, light)), 1.f);
    vec3 step_color = vec3(0.2) + v_color * diffuse;
    frag_color = vec4(step_color,1.0);    
}
`

export {point_vert_shader, point_frag_shader}