precision highp float;
varying vec2 v_texcoord;
uniform sampler2D tex;
uniform float time;
uniform vec2 screenSize;

float getOffsetStrength(float time, vec2 dir) {
    float d = length(dir) - 0.2 * (time * 5.9);
    d *= 1. - smoothstep(-1., 0.4, abs(d));
    return d;
}

void main() {
    if (time > 2.4) {
        gl_FragColor = texture2D(tex, v_texcoord);
        return;
    }

    vec2 aspectRatio = vec2(1, screenSize.x / screenSize.y);

    vec2 center = vec2(0.5);
    vec2 dir = center - v_texcoord;

    float d = getOffsetStrength(time, dir / aspectRatio);
    float shading = d;

    dir = normalize(dir);

    // Blur
    const int samples = 20;
    float blurRadius = d * 1.1;
    vec3 color = vec3(0.0);
    for (int i = 0; i < samples; i++) {
        float t = float(i) / float(samples - 1);
        vec2 offset = dir * blurRadius * t;
        color += texture2D(tex, v_texcoord + offset).rgb;
    }

    color /= float(samples);
    gl_FragColor = vec4(color, 1.0);
    gl_FragColor.rgb += clamp(shading * 0.5, 0.0, 10.0);

    // backdrop
    float fadeIn = smoothstep(0.0, 0.2, time);
    float fadeOut = smoothstep(2.1, 2.4, time);
    float backdropStrength = mix(fadeIn, 1.0, step(0.2, time)) * (1.0 - fadeOut);

    gl_FragColor.rgb *= (1.0 - backdropStrength * 0.3);
}
