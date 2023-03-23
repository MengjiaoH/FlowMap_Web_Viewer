const colorline_vert_shader = `
precision highp float;
precision highp int;
precision highp sampler2D;

layout(location = 0) in vec3 position;
layout(location = 1) in vec3 tex;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
out vec3 world_pos;
void main()  {
    vec4 affine_cube = vec4(position.x,position.y,position.z,1.0);
    vec4 camera_cube = modelViewMatrix * affine_cube;
    vec4 pix_cube = projectionMatrix * camera_cube;
    
    world_pos = tex;
    gl_Position = pix_cube;
}
`
const colorline_frag_shader = `
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

void main()  {
    vec3 ray_dir = normalize(world_pos-camera_pos);
    vec3 inv_ray_dir = 1.0/ray_dir;

    vec3 tex_coord = world_pos;
    tex_coord = (tex_coord-min_bb)/(max_bb-min_bb);
    float sf = texture(volume, tex_coord).x;
    sf = (sf-min_v)/(max_v - min_v);
    vec4 tf_val = texture(tf, vec2(sf,0.f));
    tf_val.a = 1.f;
    frag_color = tf_val;    
}
`

export {colorline_vert_shader, colorline_frag_shader}