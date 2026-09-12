// Pankaj Edit Pro - 200+ Professional Video Animations
// Categories: In (Entrance), Out (Exit), Combo (Complex Multi-Action), Loop (Continuous Camera Motion), Beat & Flash, 3D & Warp, Cinematic Camera

export type AnimationCategory = 
  | "All"
  | "In"
  | "Out"
  | "Combo"
  | "Loop"
  | "Beat & Flash"
  | "3D & Warp"
  | "Cinematic Camera";

export interface AnimationPreset200 {
  id: string;
  name: string;
  category: "In" | "Out" | "Combo" | "Loop" | "Beat & Flash" | "3D & Warp" | "Cinematic Camera";
  type: "in" | "out" | "combo" | "loop";
  duration: number; // default duration (seconds)
  tag?: "HOT" | "PRO" | "TREND" | "3D" | "VIRAL" | "NEW";
  curve: "ease-out" | "ease-in" | "bounce" | "elastic" | "spring" | "linear" | "snap" | "smooth";
  description: string;
  effect: string; // internal animation profile key
  intensity?: number;
}

export const ANIMATION_CATEGORIES: AnimationCategory[] = [
  "All",
  "In",
  "Out",
  "Combo",
  "Loop",
  "Beat & Flash",
  "3D & Warp",
  "Cinematic Camera"
];

// 1. IN ANIMATIONS (~52 presets)
const IN_PRESETS: AnimationPreset200[] = [
  { id: "in_fade", name: "Fade In", category: "In", type: "in", duration: 0.6, curve: "smooth", description: "Smooth cinematic opacity fade", effect: "fade_in" },
  { id: "in_zoom_1", name: "Zoom 1", category: "In", type: "in", duration: 0.6, tag: "HOT", curve: "ease-out", description: "Expands smoothly from center", effect: "zoom_in_center" },
  { id: "in_zoom_2", name: "Zoom 2 (Burst)", category: "In", type: "in", duration: 0.5, tag: "TREND", curve: "elastic", description: "Punches in from extreme macro scale", effect: "zoom_in_burst" },
  { id: "in_zoom_bounce", name: "Zoom Bounce", category: "In", type: "in", duration: 0.7, curve: "bounce", description: "Zooms in with snappy elastic rebound", effect: "zoom_in_bounce" },
  { id: "in_slide_right", name: "Slide Right", category: "In", type: "in", duration: 0.5, curve: "ease-out", description: "Enters smoothly from left edge", effect: "slide_right" },
  { id: "in_slide_left", name: "Slide Left", category: "In", type: "in", duration: 0.5, curve: "ease-out", description: "Enters smoothly from right edge", effect: "slide_left" },
  { id: "in_slide_up", name: "Slide Up", category: "In", type: "in", duration: 0.5, tag: "HOT", curve: "ease-out", description: "Rises up from bottom", effect: "slide_up" },
  { id: "in_slide_down", name: "Slide Down", category: "In", type: "in", duration: 0.5, curve: "ease-out", description: "Drops down from top", effect: "slide_down" },
  { id: "in_spin_cw", name: "Spin In Clockwise", category: "In", type: "in", duration: 0.6, curve: "ease-out", description: "360-degree rotation with scale up", effect: "spin_cw" },
  { id: "in_spin_ccw", name: "Spin In Counter", category: "In", type: "in", duration: 0.6, curve: "ease-out", description: "Counter-clockwise vortex entry", effect: "spin_ccw" },
  { id: "in_pop_snap", name: "Pop Snap", category: "In", type: "in", duration: 0.45, tag: "PRO", curve: "snap", description: "Quick punchy pop with micro-scale overshoot", effect: "pop_snap" },
  { id: "in_elastic_drop", name: "Elastic Drop", category: "In", type: "in", duration: 0.8, curve: "elastic", description: "Physics-driven gravity drop with jelly wobble", effect: "elastic_drop" },
  { id: "in_swing_down", name: "Swing Down", category: "In", type: "in", duration: 0.7, curve: "bounce", description: "Hinged top swing like a photo frame", effect: "swing_down" },
  { id: "in_flip_x", name: "Flip X In", category: "In", type: "in", duration: 0.6, tag: "3D", curve: "ease-out", description: "Horizontal 3D card flip entrance", effect: "flip_x" },
  { id: "in_flip_y", name: "Flip Y In", category: "In", type: "in", duration: 0.6, tag: "3D", curve: "ease-out", description: "Vertical 3D card flip entrance", effect: "flip_y" },
  { id: "in_unfold", name: "Unfold", category: "In", type: "in", duration: 0.7, curve: "ease-out", description: "Expands outward like an origami paper", effect: "unfold" },
  { id: "in_spiral", name: "Spiral Vortex", category: "In", type: "in", duration: 0.8, curve: "ease-out", description: "Spirals in from deep distance", effect: "spiral_in" },
  { id: "in_whip_left", name: "Whip Pan Left", category: "In", type: "in", duration: 0.35, tag: "TREND", curve: "snap", description: "Ultra-fast action whip pan entrance", effect: "whip_left" },
  { id: "in_whip_right", name: "Whip Pan Right", category: "In", type: "in", duration: 0.35, tag: "TREND", curve: "snap", description: "Fast dynamic whip pan from right", effect: "whip_right" },
  { id: "in_blur_focus", name: "Blur to Focus", category: "In", type: "in", duration: 0.7, curve: "smooth", description: "Deep 20px optical defocus sharpening to 4K", effect: "blur_in" },
  { id: "in_tv_static", name: "Retro TV Turn On", category: "In", type: "in", duration: 0.5, curve: "snap", description: "CRT screen beam expanding horizontally then vertically", effect: "tv_turn_on" },
  { id: "in_roll_right", name: "Roll In Right", category: "In", type: "in", duration: 0.7, curve: "ease-out", description: "Rotates while rolling across canvas", effect: "roll_right" },
  { id: "in_windmill", name: "Windmill In", category: "In", type: "in", duration: 0.8, curve: "ease-out", description: "Double rotation pinwheel entry", effect: "windmill" },
  { id: "in_split_open", name: "Split Open", category: "In", type: "in", duration: 0.6, curve: "ease-out", description: "Center split opening reveal", effect: "split_open" },
  { id: "in_skew_slide", name: "Skew Slide In", category: "In", type: "in", duration: 0.5, curve: "ease-out", description: "Slanted dynamic action slide", effect: "skew_slide" },
  { id: "in_flash_white", name: "White Flash Impact", category: "In", type: "in", duration: 0.45, tag: "HOT", curve: "snap", description: "Strobe flash bursting into full clarity", effect: "flash_in" },
  { id: "in_iris_open", name: "Iris Circle Open", category: "In", type: "in", duration: 0.6, curve: "smooth", description: "Cinematic circular camera aperture open", effect: "iris_open" },
  { id: "in_drop_bounce", name: "Heavy Drop Impact", category: "In", type: "in", duration: 0.6, curve: "bounce", description: "Heavy weight smash landing with screen shake", effect: "heavy_drop" },
  { id: "in_diagonal_tl", name: "Diagonal Top-Left", category: "In", type: "in", duration: 0.5, curve: "ease-out", description: "45-degree angle slide from top left", effect: "diag_tl" },
  { id: "in_diagonal_tr", name: "Diagonal Top-Right", category: "In", type: "in", duration: 0.5, curve: "ease-out", description: "45-degree angle slide from top right", effect: "diag_tr" },
  { id: "in_diagonal_bl", name: "Diagonal Bottom-Left", category: "In", type: "in", duration: 0.5, curve: "ease-out", description: "Slanted upward rise from bottom left", effect: "diag_bl" },
  { id: "in_diagonal_br", name: "Diagonal Bottom-Right", category: "In", type: "in", duration: 0.5, curve: "ease-out", description: "Slanted upward rise from bottom right", effect: "diag_br" },
  { id: "in_zoom_rotate", name: "Zoom & Twist", category: "In", type: "in", duration: 0.6, tag: "PRO", curve: "elastic", description: "Simultaneous 45-deg twist and scale", effect: "zoom_rotate" },
  { id: "in_glitch_strobe", name: "Cyber Glitch Strobe", category: "In", type: "in", duration: 0.5, tag: "TREND", curve: "snap", description: "RGB displacement and rapid jitter entry", effect: "glitch_in" },
  { id: "in_hyper_snap", name: "Hyper Snap", category: "In", type: "in", duration: 0.35, curve: "snap", description: "Fast 0.3s snap for rap & phonk beats", effect: "hyper_snap" },
  { id: "in_cinematic_push", name: "Slow Push In", category: "In", type: "in", duration: 1.2, curve: "smooth", description: "Gentle Hollywood anamorphic slow push", effect: "push_in_slow" },
  { id: "in_stretch_x", name: "Stretch In X", category: "In", type: "in", duration: 0.5, curve: "elastic", description: "Stretches from horizontal razor line", effect: "stretch_x" },
  { id: "in_stretch_y", name: "Stretch In Y", category: "In", type: "in", duration: 0.5, curve: "elastic", description: "Stretches from vertical center column", effect: "stretch_y" },
  { id: "in_rubber_band", name: "Rubber Band", category: "In", type: "in", duration: 0.7, curve: "elastic", description: "Playful rubber band stretch and snap", effect: "rubber_band" },
  { id: "in_jelly_wobble", name: "Jelly Wobble In", category: "In", type: "in", duration: 0.8, curve: "elastic", description: "Soft organic fluid jelly settle", effect: "jelly_wobble" },
  { id: "in_quiver_drop", name: "Quiver Drop", category: "In", type: "in", duration: 0.55, curve: "bounce", description: "Drops with high-frequency micro tremor", effect: "quiver_drop" },
  { id: "in_shutter_flash", name: "Camera Shutter Flash", category: "In", type: "in", duration: 0.4, tag: "HOT", curve: "snap", description: "Paparazzi strobe shutter pulse", effect: "shutter_flash" },
  { id: "in_3d_cube_left", name: "3D Cube Left", category: "In", type: "in", duration: 0.7, tag: "3D", curve: "ease-out", description: "Rotates in like a 3D isometric cube face", effect: "cube_left" },
  { id: "in_3d_cube_right", name: "3D Cube Right", category: "In", type: "in", duration: 0.7, tag: "3D", curve: "ease-out", description: "Rotates from right 3D prism edge", effect: "cube_right" },
  { id: "in_3d_door_swing", name: "3D Door Swing", category: "In", type: "in", duration: 0.7, tag: "3D", curve: "ease-out", description: "Swings open like a studio door", effect: "door_swing" },
  { id: "in_wave_ripple", name: "Wave Distortion In", category: "In", type: "in", duration: 0.65, curve: "smooth", description: "Underwater sine wave ripple settling into focus", effect: "wave_ripple_in" },
  { id: "in_vortex_tunnel", name: "Vortex Tunnel", category: "In", type: "in", duration: 0.9, curve: "ease-out", description: "Warp speed space vortex hyperspace entry", effect: "vortex_tunnel" },
  { id: "in_strobe_zoom", name: "Strobe Pulse Zoom", category: "In", type: "in", duration: 0.5, curve: "snap", description: "Alternating dark/bright strobe zoom", effect: "strobe_zoom" },
  { id: "in_subtle_float", name: "Subtle Float In", category: "In", type: "in", duration: 1.0, curve: "smooth", description: "Ultra-smooth luxury fashion float up", effect: "subtle_float" },
  { id: "in_cinematic_drop", name: "Cinematic Boom Drop", category: "In", type: "in", duration: 0.75, tag: "PRO", curve: "bounce", description: "Trailer bass boom camera drop", effect: "boom_drop" },
  { id: "in_slide_rotate_l", name: "Slide & Tilt Left", category: "In", type: "in", duration: 0.55, curve: "ease-out", description: "Slides in with dynamic 15-degree Dutch tilt", effect: "slide_tilt_l" },
  { id: "in_slide_rotate_r", name: "Slide & Tilt Right", category: "In", type: "in", duration: 0.55, curve: "ease-out", description: "Slides in with dynamic counter tilt", effect: "slide_tilt_r" },
];

// 2. OUT ANIMATIONS (~46 presets)
const OUT_PRESETS: AnimationPreset200[] = [
  { id: "out_fade", name: "Fade Out", category: "Out", type: "out", duration: 0.6, curve: "smooth", description: "Gentle cinematic black fade out", effect: "fade_out" },
  { id: "out_zoom_shrink", name: "Zoom Out (Shrink)", category: "Out", type: "out", duration: 0.5, tag: "HOT", curve: "ease-in", description: "Shrinks away into background", effect: "zoom_out_shrink" },
  { id: "out_zoom_burst", name: "Zoom Burst Out", category: "Out", type: "out", duration: 0.45, curve: "ease-in", description: "Blasts toward camera out of frame", effect: "zoom_out_burst" },
  { id: "out_slide_left", name: "Slide Out Left", category: "Out", type: "out", duration: 0.5, curve: "ease-in", description: "Slides smoothly off the left edge", effect: "slide_out_left" },
  { id: "out_slide_right", name: "Slide Out Right", category: "Out", type: "out", duration: 0.5, curve: "ease-in", description: "Slides smoothly off the right edge", effect: "slide_out_right" },
  { id: "out_slide_up", name: "Slide Out Up", category: "Out", type: "out", duration: 0.5, curve: "ease-in", description: "Rises rapidly off the top frame", effect: "slide_out_up" },
  { id: "out_slide_down", name: "Slide Out Down", category: "Out", type: "out", duration: 0.5, tag: "HOT", curve: "ease-in", description: "Drops gracefully off bottom frame", effect: "slide_out_down" },
  { id: "out_spin_cw", name: "Spin Out Clockwise", category: "Out", type: "out", duration: 0.6, curve: "ease-in", description: "Spins 360 degrees while shrinking", effect: "spin_out_cw" },
  { id: "out_spin_ccw", name: "Spin Out Counter", category: "Out", type: "out", duration: 0.6, curve: "ease-in", description: "Spirals away counter-clockwise", effect: "spin_out_ccw" },
  { id: "out_dissolve", name: "Vapor Dissolve", category: "Out", type: "out", duration: 0.7, curve: "smooth", description: "Dissolves softly with defocus blur", effect: "dissolve_out" },
  { id: "out_tv_off", name: "Retro TV Turn Off", category: "Out", type: "out", duration: 0.45, tag: "TREND", curve: "snap", description: "Classic CRT beam collapses into bright white center dot", effect: "tv_off" },
  { id: "out_flip_x", name: "Flip X Out", category: "Out", type: "out", duration: 0.55, tag: "3D", curve: "ease-in", description: "3D horizontal flip exit", effect: "flip_x_out" },
  { id: "out_flip_y", name: "Flip Y Out", category: "Out", type: "out", duration: 0.55, tag: "3D", curve: "ease-in", description: "3D vertical card flip exit", effect: "flip_y_out" },
  { id: "out_whip_left", name: "Whip Pan Exit Left", category: "Out", type: "out", duration: 0.35, tag: "PRO", curve: "snap", description: "Motion blur whip pan exit to left", effect: "whip_exit_l" },
  { id: "out_whip_right", name: "Whip Pan Exit Right", category: "Out", type: "out", duration: 0.35, tag: "PRO", curve: "snap", description: "Motion blur whip pan exit to right", effect: "whip_exit_r" },
  { id: "out_elastic_snap", name: "Elastic Slingshot", category: "Out", type: "out", duration: 0.5, curve: "elastic", description: "Pulls back then slingshots away", effect: "slingshot_out" },
  { id: "out_sink_down", name: "Sink Down", category: "Out", type: "out", duration: 0.6, curve: "ease-in", description: "Submerges slowly below viewport", effect: "sink_down" },
  { id: "out_fly_top_right", name: "Fly Away Top-Right", category: "Out", type: "out", duration: 0.5, curve: "ease-in", description: "Launches diagonally toward top right", effect: "fly_tr" },
  { id: "out_fly_top_left", name: "Fly Away Top-Left", category: "Out", type: "out", duration: 0.5, curve: "ease-in", description: "Launches diagonally toward top left", effect: "fly_tl" },
  { id: "out_glitch_collapse", name: "Glitch Disintegrate", category: "Out", type: "out", duration: 0.5, tag: "TREND", curve: "snap", description: "Heavy digital distortion breakdown", effect: "glitch_out" },
  { id: "out_flash_out", name: "White Flash Out", category: "Out", type: "out", duration: 0.45, curve: "snap", description: "Blinding white flash wiping clip", effect: "flash_out" },
  { id: "out_iris_close", name: "Iris Circle Close", category: "Out", type: "out", duration: 0.6, curve: "smooth", description: "Circular black iris closing focus", effect: "iris_close" },
  { id: "out_roll_out", name: "Roll Out Left", category: "Out", type: "out", duration: 0.6, curve: "ease-in", description: "Rolls like a wheel off screen left", effect: "roll_out_l" },
  { id: "out_roll_out_r", name: "Roll Out Right", category: "Out", type: "out", duration: 0.6, curve: "ease-in", description: "Rolls like a wheel off screen right", effect: "roll_out_r" },
  { id: "out_swirl_vortex", name: "Swirl Vortex Drain", category: "Out", type: "out", duration: 0.75, curve: "ease-in", description: "Drains into center whirlpool", effect: "vortex_drain" },
  { id: "out_3d_fall_back", name: "3D Fall Backward", category: "Out", type: "out", duration: 0.6, tag: "3D", curve: "ease-in", description: "Topples backward into 3D space", effect: "fall_back_3d" },
  { id: "out_3d_cube_exit", name: "3D Cube Fold Exit", category: "Out", type: "out", duration: 0.65, tag: "3D", curve: "ease-in", description: "Rotates away on 3D cubic axis", effect: "cube_exit" },
  { id: "out_blur_defocus", name: "Heavy Defocus Blur", category: "Out", type: "out", duration: 0.6, curve: "smooth", description: "Deep 25px gaussian defocus fade", effect: "defocus_out" },
  { id: "out_stretch_squeeze", name: "Squeeze Flat", category: "Out", type: "out", duration: 0.45, curve: "ease-in", description: "Compresses into a razor thin horizontal needle", effect: "squeeze_flat" },
  { id: "out_vertical_squish", name: "Vertical Squish", category: "Out", type: "out", duration: 0.45, curve: "ease-in", description: "Compresses into vertical center slit", effect: "squish_vert" },
  { id: "out_door_close", name: "3D Door Shut", category: "Out", type: "out", duration: 0.6, tag: "3D", curve: "ease-in", description: "Hinged shut like a bunker blast door", effect: "door_shut" },
  { id: "out_shutter_black", name: "Camera Shutter Black", category: "Out", type: "out", duration: 0.4, curve: "snap", description: "Quick mechanical camera blade close", effect: "shutter_black" },
  { id: "out_hyper_drop", name: "Gravity Abyss Drop", category: "Out", type: "out", duration: 0.5, curve: "ease-in", description: "Falls instantly into bottomless dark", effect: "abyss_drop" },
  { id: "out_float_away", name: "Helium Float Away", category: "Out", type: "out", duration: 0.8, curve: "smooth", description: "Floats away toward sky like a balloon", effect: "helium_float" },
  { id: "out_spiral_up", name: "Spiral Ascend", category: "Out", type: "out", duration: 0.75, curve: "ease-in", description: "Spirals upward while diminishing", effect: "spiral_up" },
  { id: "out_page_curl", name: "Page Peel Out", category: "Out", type: "out", duration: 0.6, curve: "ease-in", description: "Peels away like glossy magazine paper", effect: "page_peel" },
  { id: "out_strobe_burn", name: "Film Burn Out", category: "Out", type: "out", duration: 0.5, tag: "HOT", curve: "snap", description: "Overexposed celluloid melting effect", effect: "film_burn" },
  { id: "out_skew_dart", name: "Skew Dart Right", category: "Out", type: "out", duration: 0.4, curve: "snap", description: "Darts forward like a comic book speedline", effect: "skew_dart" },
  { id: "out_pendulum_fall", name: "Pendulum Detach", category: "Out", type: "out", duration: 0.65, curve: "ease-in", description: "Swings once then snaps off its anchor", effect: "pendulum_detach" },
  { id: "out_diagonal_down_l", name: "Diagonal Exit BL", category: "Out", type: "out", duration: 0.5, curve: "ease-in", description: "Exits via bottom-left diagonal", effect: "diag_out_bl" },
  { id: "out_diagonal_down_r", name: "Diagonal Exit BR", category: "Out", type: "out", duration: 0.5, curve: "ease-in", description: "Exits via bottom-right diagonal", effect: "diag_out_br" },
  { id: "out_bounce_fade", name: "Bounce & Fade", category: "Out", type: "out", duration: 0.6, curve: "bounce", description: "Rebounds once then fades rapidly", effect: "bounce_fade" },
  { id: "out_vhs_glitch_cut", name: "Tape Eject Glitch", category: "Out", type: "out", duration: 0.4, tag: "TREND", curve: "snap", description: "VHS tape stop rewind glitch", effect: "vhs_eject" },
  { id: "out_smoke_drift", name: "Smoke Drift Dissolve", category: "Out", type: "out", duration: 0.85, curve: "smooth", description: "Drifts upward dissipating like mist", effect: "smoke_drift" },
  { id: "out_super_shrink", name: "Atom Shrink", category: "Out", type: "out", duration: 0.4, curve: "snap", description: "Zero-point singularity collapse", effect: "atom_shrink" },
  { id: "out_quiver_fade", name: "Quiver Fade", category: "Out", type: "out", duration: 0.55, curve: "smooth", description: "Micro-tremor dissolving to transparency", effect: "quiver_fade" },
];

// 3. COMBO ANIMATIONS (~56 presets)
const COMBO_PRESETS: AnimationPreset200[] = [
  { id: "combo_zoom_1", name: "Zoom 1 & Pan", category: "Combo", type: "combo", duration: 1.2, tag: "HOT", curve: "smooth", description: "Classic CapCut continuous cinematic zoom and drift", effect: "combo_zoom_pan" },
  { id: "combo_zoom_2", name: "Zoom 2 & Shake", category: "Combo", type: "combo", duration: 1.0, tag: "HOT", curve: "bounce", description: "Dynamic macro zoom with rhythmic beat shake", effect: "combo_zoom_shake" },
  { id: "combo_pendulum_1", name: "Pendulum 1", category: "Combo", type: "combo", duration: 1.4, curve: "smooth", description: "Gentle grandfather clock pendulum sway", effect: "combo_pendulum_1" },
  { id: "combo_pendulum_2", name: "Pendulum 2 (Fast)", category: "Combo", type: "combo", duration: 0.9, tag: "TREND", curve: "bounce", description: "Aggressive rhythmic pendulum rocking", effect: "combo_pendulum_2" },
  { id: "combo_3d_flip_1", name: "3D Flip 1", category: "Combo", type: "combo", duration: 1.2, tag: "3D", curve: "elastic", description: "Continuous 3D card tumble and spring", effect: "combo_3d_flip_1" },
  { id: "combo_3d_flip_2", name: "3D Flip 2 (Tilt)", category: "Combo", type: "combo", duration: 1.2, tag: "3D", curve: "smooth", description: "Continuous 3D Dutch tilt with depth parallax", effect: "combo_3d_flip_2" },
  { id: "combo_wobble", name: "Wobble Hop", category: "Combo", type: "combo", duration: 0.8, curve: "bounce", description: "Cartoonish squishy wobble and hop", effect: "combo_wobble" },
  { id: "combo_distort", name: "Distort Wave", category: "Combo", type: "combo", duration: 1.1, curve: "smooth", description: "Psychedelic optical warp oscillation", effect: "combo_distort" },
  { id: "combo_glitch_hop", name: "Glitch Hop", category: "Combo", type: "combo", duration: 0.75, tag: "TREND", curve: "snap", description: "Streetwear cyber glitch jump cuts", effect: "combo_glitch_hop" },
  { id: "combo_bounce_spin", name: "Bounce & Spin", category: "Combo", type: "combo", duration: 1.0, curve: "bounce", description: "Bounces rhythmically while slowly rotating", effect: "combo_bounce_spin" },
  { id: "combo_skew_bounce", name: "Skew Bounce", category: "Combo", type: "combo", duration: 0.85, curve: "elastic", description: "Slanted kinetic bounce for upbeat reels", effect: "combo_skew_bounce" },
  { id: "combo_heartbeat", name: "Heartbeat Pulse", category: "Combo", type: "combo", duration: 0.8, tag: "HOT", curve: "bounce", description: "Double-thump organic cardiac zoom pulse", effect: "combo_heartbeat" },
  { id: "combo_disco_flash", name: "Disco Strobe", category: "Combo", type: "combo", duration: 0.6, tag: "VIRAL", curve: "snap", description: "High-voltage club strobe and zoom cuts", effect: "combo_disco" },
  { id: "combo_cyber_shake", name: "Cyber Shake", category: "Combo", type: "combo", duration: 0.5, tag: "PRO", curve: "snap", description: "High-frequency gaming killcam tremor", effect: "combo_cyber_shake" },
  { id: "combo_retro_strobe", name: "Retro Strobe Zoom", category: "Combo", type: "combo", duration: 0.9, curve: "snap", description: "90s MTV rapid strobe pulses", effect: "combo_retro_strobe" },
  { id: "combo_kinetic_zoom", name: "Kinetic Punch", category: "Combo", type: "combo", duration: 0.7, curve: "elastic", description: "Snappy punch-in synchronized to snares", effect: "combo_kinetic_punch" },
  { id: "combo_swirl_twist", name: "Swirl Twist", category: "Combo", type: "combo", duration: 1.2, curve: "smooth", description: "Continuous harmonic vortex rocking", effect: "combo_swirl_twist" },
  { id: "combo_jitter_hop", name: "Jitter Hop", category: "Combo", type: "combo", duration: 0.65, curve: "bounce", description: "Stop-motion claymation jitter style", effect: "combo_jitter_hop" },
  { id: "combo_quick_shake", name: "Quick Shake H", category: "Combo", type: "combo", duration: 0.4, curve: "snap", description: "Horizontal rapid machine vibration", effect: "combo_quick_shake_h" },
  { id: "combo_quick_shake_v", name: "Quick Shake V", category: "Combo", type: "combo", duration: 0.4, curve: "snap", description: "Vertical rapid piston vibration", effect: "combo_quick_shake_v" },
  { id: "combo_earthquake", name: "Earthquake 8.0", category: "Combo", type: "combo", duration: 0.9, tag: "PRO", curve: "bounce", description: "Massive cinematic seismic rumble", effect: "combo_earthquake" },
  { id: "combo_3d_cube_spin", name: "3D Cube Continuous", category: "Combo", type: "combo", duration: 1.5, tag: "3D", curve: "smooth", description: "Full 3D floating prism tumble", effect: "combo_cube_spin" },
  { id: "combo_flip_zoom", name: "Flip & Zoom In", category: "Combo", type: "combo", duration: 1.1, tag: "3D", curve: "elastic", description: "180-deg flip into extreme close-up", effect: "combo_flip_zoom" },
  { id: "combo_parallax_roll", name: "Parallax Horizon Roll", category: "Combo", type: "combo", duration: 1.8, curve: "smooth", description: "Gentle rolling aircraft cockpit tilt", effect: "combo_parallax_roll" },
  { id: "combo_flash_zoom", name: "Flash Strobe Zoom", category: "Combo", type: "combo", duration: 0.8, tag: "VIRAL", curve: "snap", description: "Bright impact flash with sudden scale-in", effect: "combo_flash_zoom" },
  { id: "combo_velocity_warp", name: "Velocity Ramp Snap", category: "Combo", type: "combo", duration: 0.85, tag: "VIRAL", curve: "snap", description: "Anime velocity edit: slow-fast-slow zoom", effect: "combo_velocity_warp" },
  { id: "combo_warp_ripple", name: "Warp Liquid Ripple", category: "Combo", type: "combo", duration: 1.2, curve: "smooth", description: "Fluid surface optical breathing", effect: "combo_liquid_ripple" },
  { id: "combo_bass_rumble", name: "Sub-Bass Tremor", category: "Combo", type: "combo", duration: 0.7, tag: "HOT", curve: "bounce", description: "Low-end 808 woofer vibrating the frame", effect: "combo_bass_rumble" },
  { id: "combo_dutch_rock", name: "Dutch Angle Rock", category: "Combo", type: "combo", duration: 1.3, curve: "smooth", description: "Thriller suspense rocking camera angle", effect: "combo_dutch_rock" },
  { id: "combo_rubber_bounce", name: "Rubber Trampoline", category: "Combo", type: "combo", duration: 0.8, curve: "elastic", description: "High elasticity trampoline rebounds", effect: "combo_rubber_bounce" },
  { id: "combo_floating_orbit", name: "Zero-G Orbit", category: "Combo", type: "combo", duration: 2.0, tag: "PRO", curve: "smooth", description: "Astronaut zero-gravity float and pivot", effect: "combo_zero_g" },
  { id: "combo_rgb_glitch_hop", name: "RGB Split Jitter", category: "Combo", type: "combo", duration: 0.6, tag: "TREND", curve: "snap", description: "Chromatic aberration with jittering offsets", effect: "combo_rgb_split" },
  { id: "combo_phonk_wobble", name: "Drift Phonk Wobble", category: "Combo", type: "combo", duration: 0.75, tag: "VIRAL", curve: "bounce", description: "Aggressive car drift camera tilt and zoom", effect: "combo_phonk_wobble" },
  { id: "combo_cinematic_breathing", name: "Cinematic Breathing", category: "Combo", type: "combo", duration: 2.2, curve: "smooth", description: "Organic gentle scale oscillation (1.0 to 1.08)", effect: "combo_breathing" },
  { id: "combo_whip_return", name: "Whip Pan & Return", category: "Combo", type: "combo", duration: 0.6, curve: "snap", description: "Quick snap to left and snap back to center", effect: "combo_whip_return" },
  { id: "combo_accordion", name: "Accordion Elastic", category: "Combo", type: "combo", duration: 0.9, curve: "elastic", description: "Expands horizontally while squeezing vertically", effect: "combo_accordion" },
  { id: "combo_vhs_tracking", name: "VHS Head Jitter", category: "Combo", type: "combo", duration: 0.5, curve: "snap", description: "VCR tape tracking noise vertical hop", effect: "combo_vhs_head" },
  { id: "combo_speed_punch", name: "Combat Speed Punch", category: "Combo", type: "combo", duration: 0.45, tag: "HOT", curve: "snap", description: "Action movie impact hit punch-zoom", effect: "combo_speed_punch" },
  { id: "combo_pendulum_zoom", name: "Pendulum & Zoom", category: "Combo", type: "combo", duration: 1.3, curve: "smooth", description: "Dual-axis swing coupled with depth zoom", effect: "combo_pendulum_zoom" },
  { id: "combo_hyper_strobe", name: "Hyper Strobe 120BPM", category: "Combo", type: "combo", duration: 0.5, curve: "snap", description: "Locked precisely to 120 BPM house dance rhythm", effect: "combo_strobe_120bpm" },
  { id: "combo_spiral_rock", name: "Spiral Rock", category: "Combo", type: "combo", duration: 1.1, curve: "bounce", description: "Mini vortex twisting back and forth", effect: "combo_spiral_rock" },
  { id: "combo_slanted_bounce", name: "30-Deg Slanted Bounce", category: "Combo", type: "combo", duration: 0.8, curve: "elastic", description: "Diagonal kinetic hip-hop bouncing", effect: "combo_slanted_bounce" },
  { id: "combo_handheld_run", name: "Action Handheld Run", category: "Combo", type: "combo", duration: 0.9, curve: "bounce", description: "Fast-paced chase scene camera steps", effect: "combo_handheld_run" },
  { id: "combo_zoom_in_out", name: "Breathing Zoom Loop", category: "Combo", type: "combo", duration: 1.4, curve: "smooth", description: "Continuous hypnotic in-and-out scale loop", effect: "combo_zoom_loop" },
  { id: "combo_neon_flicker", name: "Neon Sign Flicker", category: "Combo", type: "combo", duration: 0.8, tag: "TREND", curve: "snap", description: "Tokyo cyberpunk neon voltage drop flicker", effect: "combo_neon_flicker" },
  { id: "combo_card_shuffle", name: "Card Deck Shuffle", category: "Combo", type: "combo", duration: 0.9, tag: "3D", curve: "elastic", description: "Rapid 3D tilt like flipping tarot cards", effect: "combo_card_shuffle" },
  { id: "combo_wave_distort", name: "Wave Form Distortion", category: "Combo", type: "combo", duration: 1.0, curve: "smooth", description: "Harmonic audio wave visual wobble", effect: "combo_wave_distort" },
  { id: "combo_tilt_shift", name: "Tilt-Shift Mini", category: "Combo", type: "combo", duration: 1.3, curve: "smooth", description: "Miniature diorama perspective swing", effect: "combo_tilt_shift" },
  { id: "combo_rebound_snap", name: "Dual Rebound Snap", category: "Combo", type: "combo", duration: 0.75, curve: "elastic", description: "Hits left boundary then right boundary", effect: "combo_rebound_snap" },
  { id: "combo_kinetic_drift", name: "Kinetic Drift Zoom", category: "Combo", type: "combo", duration: 1.5, tag: "PRO", curve: "smooth", description: "Subtle continuous 4K cinema dolly push", effect: "combo_kinetic_drift" },
  { id: "combo_snap_rotation", name: "90-Deg Snap Cuts", category: "Combo", type: "combo", duration: 0.6, tag: "HOT", curve: "snap", description: "Snaps through dynamic angular cuts", effect: "combo_snap_rot" },
  { id: "combo_subwoofer_kick", name: "Subwoofer Kick", category: "Combo", type: "combo", duration: 0.4, tag: "VIRAL", curve: "snap", description: "Heavy EDM kick drum air compression pop", effect: "combo_subwoofer_kick" },
  { id: "combo_vertigo_dolly", name: "Vertigo Dolly Zoom", category: "Combo", type: "combo", duration: 1.6, tag: "PRO", curve: "smooth", description: "Hitchcock dolly zoom: foreground stable, background warps", effect: "combo_vertigo" },
  { id: "combo_jelly_pulse", name: "Jelly Fluid Pulse", category: "Combo", type: "combo", duration: 0.9, curve: "elastic", description: "Super fluid organic jelly breathing", effect: "combo_jelly_pulse" },
  { id: "combo_electric_shock", name: "Electric Shock Tremor", category: "Combo", type: "combo", duration: 0.45, curve: "snap", description: "High-voltage lightning impact jitter", effect: "combo_electric_shock" },
  { id: "combo_cinematic_sway", name: "Cinematic Luxury Sway", category: "Combo", type: "combo", duration: 2.0, tag: "PRO", curve: "smooth", description: "Slow elegant gimbal sway for fashion & architecture", effect: "combo_luxury_sway" },
];

// 4. LOOP & CONTINUOUS ANIMATIONS (~35 presets)
const LOOP_PRESETS: AnimationPreset200[] = [
  { id: "loop_slow_drift", name: "Slow Cinematic Drift", category: "Loop", type: "loop", duration: 3.0, curve: "smooth", description: "Slow continuous cinematic drift in luxury videos", effect: "loop_slow_drift" },
  { id: "loop_push_forward", name: "Continuous Push In", category: "Loop", type: "loop", duration: 4.0, tag: "HOT", curve: "linear", description: "Constant slow dolly push (1.00x -> 1.15x)", effect: "loop_push_forward" },
  { id: "loop_pull_back", name: "Continuous Pull Out", category: "Loop", type: "loop", duration: 4.0, curve: "linear", description: "Constant slow dolly pull (1.15x -> 1.00x)", effect: "loop_pull_back" },
  { id: "loop_floating_cloud", name: "Floating Cloud", category: "Loop", type: "loop", duration: 2.5, curve: "smooth", description: "Hypnotic figure-8 infinity floating pattern", effect: "loop_figure_8" },
  { id: "loop_gentle_breathing", name: "Gentle Breathing", category: "Loop", type: "loop", duration: 2.0, tag: "PRO", curve: "smooth", description: "Soothing natural respiratory scale oscillation", effect: "loop_breathing" },
  { id: "loop_handheld_camera", name: "Handheld Indie Cam", category: "Loop", type: "loop", duration: 1.5, tag: "TREND", curve: "smooth", description: "Natural human micro-tremors from a handheld cinema rig", effect: "loop_handheld" },
  { id: "loop_steams_rise", name: "Heat Haze Shimmer", category: "Loop", type: "loop", duration: 1.2, curve: "smooth", description: "Mirage heatwave ripple continuously rising", effect: "loop_heat_haze" },
  { id: "loop_neon_pulse", name: "Neon Glow Breathing", category: "Loop", type: "loop", duration: 1.4, curve: "smooth", description: "Cyberpunk neon brightness pulsing", effect: "loop_neon_pulse" },
  { id: "loop_bass_vibration", name: "Subwoofer Bass Continuous", category: "Loop", type: "loop", duration: 0.5, curve: "bounce", description: "Non-stop low frequency acoustic vibration", effect: "loop_bass_vib" },
  { id: "loop_orbit_tilt", name: "Orbit 3D Tilt", category: "Loop", type: "loop", duration: 2.5, tag: "3D", curve: "smooth", description: "Gentle 3D gyroscope orbit rotation", effect: "loop_orbit_tilt" },
  { id: "loop_pendulum_clock", name: "Clockwork Pendulum", category: "Loop", type: "loop", duration: 1.6, curve: "smooth", description: "Exact rhythmic clock pendulum swing", effect: "loop_clockwork" },
  { id: "loop_gentle_sway", name: "Gentle Ocean Sway", category: "Loop", type: "loop", duration: 2.8, curve: "smooth", description: "Soft boat rocking on calm ocean waters", effect: "loop_ocean_sway" },
  { id: "loop_subtle_jitter", name: "Film Stock Jitter", category: "Loop", type: "loop", duration: 0.35, curve: "snap", description: "Vintage 16mm mechanical gate weave jitter", effect: "loop_gate_weave" },
  { id: "loop_horizon_drift_l", name: "Horizontal Drift Left", category: "Loop", type: "loop", duration: 3.5, curve: "linear", description: "Constant slow horizontal panning toward left", effect: "loop_pan_left" },
  { id: "loop_horizon_drift_r", name: "Horizontal Drift Right", category: "Loop", type: "loop", duration: 3.5, curve: "linear", description: "Constant slow horizontal panning toward right", effect: "loop_pan_right" },
  { id: "loop_pan_up", name: "Vertical Tilt Up", category: "Loop", type: "loop", duration: 3.5, curve: "linear", description: "Constant slow cinematic pedestal rise", effect: "loop_tilt_up" },
  { id: "loop_pan_down", name: "Vertical Tilt Down", category: "Loop", type: "loop", duration: 3.5, curve: "linear", description: "Constant slow cinematic pedestal drop", effect: "loop_tilt_down" },
  { id: "loop_heart_rhythm", name: "Cardio Rhythm", category: "Loop", type: "loop", duration: 0.9, curve: "bounce", description: "Steady 72 BPM resting heart thump loop", effect: "loop_cardio" },
  { id: "loop_drone_hover", name: "FPV Drone Hover", category: "Loop", type: "loop", duration: 1.8, tag: "PRO", curve: "smooth", description: "Quadcopter micro-corrections against wind", effect: "loop_drone_hover" },
  { id: "loop_vhs_flutter", name: "VHS Chroma Flutter", category: "Loop", type: "loop", duration: 0.6, curve: "snap", description: "Continuous VHS tape tape flutter and jitter", effect: "loop_vhs_flutter" },
  { id: "loop_rotary_bob", name: "Circular Bobbing", category: "Loop", type: "loop", duration: 2.0, curve: "smooth", description: "Circular Ferris wheel orbital movement", effect: "loop_circular_bob" },
  { id: "loop_micro_bounce", name: "Micro Upbeat Hop", category: "Loop", type: "loop", duration: 0.7, curve: "bounce", description: "Subtle rhythmic head-nodding loop", effect: "loop_micro_hop" },
  { id: "loop_candle_flicker", name: "Candlelight Flicker", category: "Loop", type: "loop", duration: 0.8, curve: "snap", description: "Warm organic flame brightness jitter", effect: "loop_candle" },
  { id: "loop_dutch_sway", name: "Dutch Angle Sway", category: "Loop", type: "loop", duration: 2.2, curve: "smooth", description: "Slow continuous tilting (-6 deg to +6 deg)", effect: "loop_dutch_sway" },
  { id: "loop_elastic_pulse", name: "Elastic Heart Pulse", category: "Loop", type: "loop", duration: 1.1, curve: "elastic", description: "Springy elastic heartbeat breathing", effect: "loop_elastic_pulse" },
  { id: "loop_car_ride", name: "Asphalt Car Ride", category: "Loop", type: "loop", duration: 0.85, curve: "bounce", description: "Gentle road bumps inside a driving vehicle", effect: "loop_car_ride" },
  { id: "loop_cinematic_zoom_rock", name: "Zoom & Rock Harmony", category: "Loop", type: "loop", duration: 2.4, tag: "HOT", curve: "smooth", description: "Synchronized dual-axis zoom and roll", effect: "loop_zoom_rock" },
  { id: "loop_glitch_whisper", name: "Subtle Glitch Twitch", category: "Loop", type: "loop", duration: 1.2, curve: "snap", description: "Occasional micro twitch for hacker aesthetics", effect: "loop_glitch_twitch" },
  { id: "loop_float_zen", name: "Zen Float Meditation", category: "Loop", type: "loop", duration: 3.2, curve: "smooth", description: "Ultra-deep slow meditative floating", effect: "loop_zen_float" },
  { id: "loop_helicopter_thump", name: "Chopper Rotor Thump", category: "Loop", type: "loop", duration: 0.45, curve: "bounce", description: "Rhythmic heavy rotor blade air pulse", effect: "loop_rotor_thump" },
  { id: "loop_warp_breathing", name: "Cosmic Warp Breathing", category: "Loop", type: "loop", duration: 1.7, tag: "3D", curve: "smooth", description: "Interstellar space-time contraction", effect: "loop_cosmic_warp" },
  { id: "loop_subwoofer_pop", name: "808 Woofer Pop", category: "Loop", type: "loop", duration: 0.6, curve: "snap", description: "Continuous punchy trap kick wobble", effect: "loop_woofer_pop" },
  { id: "loop_disco_pulse", name: "Dancefloor Light Pulse", category: "Loop", type: "loop", duration: 0.5, curve: "snap", description: "128 BPM festival mainstage lighting pulse", effect: "loop_festival_pulse" },
  { id: "loop_gimbal_steady", name: "Ronin Gimbal Drift", category: "Loop", type: "loop", duration: 2.6, tag: "PRO", curve: "smooth", description: "Flawless motorized 3-axis gimbal float", effect: "loop_ronin_gimbal" },
  { id: "loop_cinematic_tilt", name: "Cinema Scenics Tilt", category: "Loop", type: "loop", duration: 3.0, curve: "smooth", description: "Graceful vertical landscape camera tilt", effect: "loop_scenics_tilt" },
];

// 5. BEAT & FLASH / 3D WARP / CINEMATIC CAMERA (~36 presets)
const SPECIAL_PRESETS: AnimationPreset200[] = [
  { id: "beat_drop_1", name: "Trap Beat Drop", category: "Beat & Flash", type: "combo", duration: 0.4, tag: "VIRAL", curve: "snap", description: "Violent instant 1.35x zoom on beat impact", effect: "beat_drop_1" },
  { id: "beat_heavy_bass", name: "Heavy 808 Bass Impact", category: "Beat & Flash", type: "combo", duration: 0.45, tag: "VIRAL", curve: "bounce", description: "Massive screen distortion and low-end kick rumble", effect: "beat_heavy_bass" },
  { id: "beat_strobe_flash", name: "White Strobe Beat", category: "Beat & Flash", type: "combo", duration: 0.35, tag: "HOT", curve: "snap", description: "Blinding white flash synced to drum hits", effect: "beat_strobe_flash" },
  { id: "beat_rgb_split", name: "RGB Split Hit", category: "Beat & Flash", type: "combo", duration: 0.4, tag: "TREND", curve: "snap", description: "Red/Cyan chromatic separation burst", effect: "beat_rgb_split" },
  { id: "beat_punch_out", name: "Bass Punch Out", category: "Beat & Flash", type: "combo", duration: 0.35, curve: "snap", description: "Reverse punch scale out on snare snap", effect: "beat_punch_out" },
  { id: "beat_velocity_drop", name: "Velocity Ramp Flash", category: "Beat & Flash", type: "combo", duration: 0.5, tag: "VIRAL", curve: "snap", description: "Fast-forward zoom into bright white hit", effect: "beat_velocity_flash" },
  { id: "beat_shake_flash", name: "Shake & Flash Combo", category: "Beat & Flash", type: "combo", duration: 0.45, tag: "HOT", curve: "bounce", description: "High-voltage shake combined with exposure pop", effect: "beat_shake_flash" },
  { id: "beat_hyper_zoom", name: "Hyper Zoom In-Out", category: "Beat & Flash", type: "combo", duration: 0.4, curve: "elastic", description: "0.2s rocket in and 0.2s rocket out", effect: "beat_hyper_zoom" },
  { id: "beat_bass_quake", name: "Sub-Bass Quake", category: "Beat & Flash", type: "combo", duration: 0.55, tag: "PRO", curve: "bounce", description: "Low frequency ground-shattering bass rumble", effect: "beat_bass_quake" },
  { id: "beat_glitch_kick", name: "Cyber Glitch Kick", category: "Beat & Flash", type: "combo", duration: 0.35, tag: "TREND", curve: "snap", description: "Matrix glitch artifact on the drop", effect: "beat_glitch_kick" },
  { id: "beat_strobe_double", name: "Double Flash Pop", category: "Beat & Flash", type: "combo", duration: 0.4, curve: "snap", description: "Double-tap flash pulse for hi-hat rolls", effect: "beat_double_flash" },
  { id: "beat_stutter_zoom", name: "16th-Note Stutter Zoom", category: "Beat & Flash", type: "combo", duration: 0.5, curve: "snap", description: "High speed stutter stepped zoom", effect: "beat_stutter_zoom" },

  // 3D & Warp Presets
  { id: "warp_3d_room", name: "3D Perspective Room", category: "3D & Warp", type: "combo", duration: 1.4, tag: "3D", curve: "smooth", description: "Rotating inside a 3D isometric projection room", effect: "warp_3d_room" },
  { id: "warp_3d_cylinder", name: "3D Cylinder Wrap", category: "3D & Warp", type: "combo", duration: 1.5, tag: "3D", curve: "smooth", description: "Curving along a 3D glass cylinder surface", effect: "warp_3d_cylinder" },
  { id: "warp_liquid_wave", name: "Liquid Ripple Warp", category: "3D & Warp", type: "combo", duration: 1.2, curve: "smooth", description: "Fluid ocean waves distorting the canvas", effect: "warp_liquid_wave" },
  { id: "warp_fisheye_lens", name: "Action Fisheye Pulse", category: "3D & Warp", type: "combo", duration: 1.0, tag: "HOT", curve: "elastic", description: "Skateboard GoPro ultra-wide fisheye barrel distortion", effect: "warp_fisheye" },
  { id: "warp_kaleidoscope", name: "Kaleidoscope Prism", category: "3D & Warp", type: "combo", duration: 1.3, tag: "VIRAL", curve: "smooth", description: "Psychedelic multifaceted prism reflections", effect: "warp_kaleidoscope" },
  { id: "warp_sphere_twist", name: "3D Sphere Twist", category: "3D & Warp", type: "combo", duration: 1.4, tag: "3D", curve: "smooth", description: "Spherical 360-degree equatorial twist", effect: "warp_sphere_twist" },
  { id: "warp_swirl_blackhole", name: "Black Hole Gravitational Warp", category: "3D & Warp", type: "combo", duration: 1.6, tag: "PRO", curve: "smooth", description: "Einstein gravity lens light bending", effect: "warp_blackhole" },
  { id: "warp_origami_fold", name: "Origami Paper Fold", category: "3D & Warp", type: "combo", duration: 1.1, tag: "3D", curve: "elastic", description: "Folds along geometric 3D crease lines", effect: "warp_origami" },
  { id: "warp_rubber_sheet", name: "Rubber Trampoline Warp", category: "3D & Warp", type: "combo", duration: 0.9, curve: "elastic", description: "Physical trampoline center depression bounce", effect: "warp_rubber" },
  { id: "warp_skew_shear", name: "Matrix Shear Transform", category: "3D & Warp", type: "combo", duration: 0.8, curve: "smooth", description: "Dynamic isometric shear matrix transformation", effect: "warp_shear" },
  { id: "warp_speed_tunnel", name: "Hyper Speed Warp Tunnel", category: "3D & Warp", type: "combo", duration: 1.2, tag: "TREND", curve: "snap", description: "Light-speed hyperdrive star-tunnel warp", effect: "warp_hyper_tunnel" },
  { id: "warp_water_drop", name: "Water Droplet Impact", category: "3D & Warp", type: "combo", duration: 0.9, curve: "elastic", description: "Concentric circular ripples expanding from center", effect: "warp_water_drop" },

  // Cinematic Camera Presets
  { id: "cam_hollywood_crane", name: "Hollywood Techno-Crane", category: "Cinematic Camera", type: "combo", duration: 2.2, tag: "PRO", curve: "smooth", description: "Sweeping Hollywood crane rising up and panning", effect: "cam_techno_crane" },
  { id: "cam_vertigo_dolly", name: "Hitchcock Vertigo Zoom", category: "Cinematic Camera", type: "combo", duration: 2.0, tag: "PRO", curve: "smooth", description: "Famous dolly-in zoom-out vertigo effect", effect: "cam_vertigo" },
  { id: "cam_steadicam_sprint", name: "Steadicam Follow Sprint", category: "Cinematic Camera", type: "combo", duration: 1.1, tag: "HOT", curve: "bounce", description: "High-octane tracking shot behind the subject", effect: "cam_steadicam_sprint" },
  { id: "cam_drone_flyover", name: "Cinematic Drone Flyover", category: "Cinematic Camera", type: "combo", duration: 2.5, tag: "PRO", curve: "smooth", description: "Majestic aerial flyover with horizon tilt", effect: "cam_drone_flyover" },
  { id: "cam_car_chase_cam", name: "Bumper Mount Chase Cam", category: "Cinematic Camera", type: "combo", duration: 0.85, tag: "TREND", curve: "bounce", description: "Fast and furious low-angle high-speed bumper camera", effect: "cam_car_chase" },
  { id: "cam_whip_pan_cinema", name: "Cinematic 180 Whip Pan", category: "Cinematic Camera", type: "combo", duration: 0.5, tag: "HOT", curve: "snap", description: "Ultra-crisp 180-degree motion blur transition whip", effect: "cam_whip_pan" },
  { id: "cam_crash_zoom", name: "Tarantino Crash Zoom", category: "Cinematic Camera", type: "combo", duration: 0.4, tag: "PRO", curve: "snap", description: "Iconic sudden violent optical zoom directly into face", effect: "cam_crash_zoom" },
  { id: "cam_dutch_tension", name: "Film Noir Dutch Angle", category: "Cinematic Camera", type: "combo", duration: 1.8, curve: "smooth", description: "Ominous slanted camera creating psychological suspense", effect: "cam_dutch_noir" },
  { id: "cam_macro_orbit", name: "Macro 360 Orbit", category: "Cinematic Camera", type: "combo", duration: 2.4, tag: "3D", curve: "smooth", description: "Product commercial 360-degree rotating turntable", effect: "cam_macro_orbit" },
  { id: "cam_handheld_documentary", name: "Documentary Handheld", category: "Cinematic Camera", type: "combo", duration: 1.6, curve: "smooth", description: "Raw authentic cinema verite observational camera", effect: "cam_documentary" },
  { id: "cam_bullet_time", name: "Matrix Bullet Time Pause", category: "Cinematic Camera", type: "combo", duration: 1.5, tag: "VIRAL", curve: "smooth", description: "Frozen moment 3D orbital sweep around the scene", effect: "cam_bullet_time" },
  { id: "cam_panavision_anamorphic", name: "Panavision Anamorphic Push", category: "Cinematic Camera", type: "combo", duration: 2.6, tag: "PRO", curve: "smooth", description: "2.39:1 widescreen cinema optical dolly push", effect: "cam_panavision_push" }
];

// Combine all 200+ Presets into single master library
export const ANIMATIONS_200: AnimationPreset200[] = [
  ...IN_PRESETS,
  ...OUT_PRESETS,
  ...COMBO_PRESETS,
  ...LOOP_PRESETS,
  ...SPECIAL_PRESETS
];

// Helper to look up an animation preset by ID
export function getAnimationById(id: string): AnimationPreset200 | undefined {
  return ANIMATIONS_200.find((a) => a.id === id);
}

// Transform output from calculated animation frame
export interface AnimationTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  filter?: string; // extra CSS filter like brightness or blur
}

// Master Math Engine for calculating precise Canvas transforms at relTime
export function calculateAnimationTransform(
  anim: AnimationPreset200,
  timeInTrimmedClip: number,
  clipDuration: number,
  width: number,
  height: number,
  customDuration?: number
): AnimationTransform {
  const defaultRes: AnimationTransform = {
    x: 0,
    y: 0,
    scale: 1.0,
    rotation: 0,
    opacity: 1.0,
    filter: ""
  };

  if (!anim) return defaultRes;

  const duration = Math.min(customDuration ?? anim.duration ?? 0.6, clipDuration);

  // 1. IN ANIMATION: Active during first `duration` seconds
  if (anim.type === "in") {
    if (timeInTrimmedClip >= duration) {
      return defaultRes; // Finished entrance
    }
    const rawT = Math.max(0, Math.min(1, timeInTrimmedClip / duration));
    const t = applyCurve(rawT, anim.curve);

    switch (anim.effect) {
      case "fade_in":
        return { ...defaultRes, opacity: t };
      case "zoom_in_center":
        return { ...defaultRes, scale: 0.1 + 0.9 * t, opacity: t };
      case "zoom_in_burst":
        return { ...defaultRes, scale: 2.5 - 1.5 * t, opacity: t };
      case "zoom_in_bounce": {
        const bounceScale = rawT < 0.7 ? (rawT / 0.7) * 1.15 : 1.15 - ((rawT - 0.7) / 0.3) * 0.15;
        return { ...defaultRes, scale: Math.max(0.1, bounceScale), opacity: Math.min(1, rawT * 2) };
      }
      case "slide_right":
        return { ...defaultRes, x: -width * (1 - t), opacity: t };
      case "slide_left":
        return { ...defaultRes, x: width * (1 - t), opacity: t };
      case "slide_up":
        return { ...defaultRes, y: height * (1 - t), opacity: t };
      case "slide_down":
        return { ...defaultRes, y: -height * (1 - t), opacity: t };
      case "spin_cw":
        return { ...defaultRes, rotation: 360 * (1 - t), scale: 0.2 + 0.8 * t, opacity: t };
      case "spin_ccw":
        return { ...defaultRes, rotation: -360 * (1 - t), scale: 0.2 + 0.8 * t, opacity: t };
      case "pop_snap": {
        const s = rawT < 0.6 ? (rawT / 0.6) * 1.2 : 1.2 - ((rawT - 0.6) / 0.4) * 0.2;
        return { ...defaultRes, scale: Math.max(0, s), opacity: Math.min(1, rawT * 3) };
      }
      case "elastic_drop":
        return { ...defaultRes, y: -height * (1 - t), scale: 0.9 + 0.1 * t, opacity: Math.min(1, rawT * 2) };
      case "swing_down":
        return { ...defaultRes, rotation: -45 * (1 - t), y: -height * 0.3 * (1 - t), opacity: t };
      case "flip_x":
        return { ...defaultRes, scale: Math.max(0.01, Math.abs(Math.cos((1 - t) * Math.PI / 2))), opacity: t };
      case "flip_y":
        return { ...defaultRes, scale: Math.max(0.01, Math.abs(Math.sin(t * Math.PI / 2))), opacity: t };
      case "unfold":
        return { ...defaultRes, scale: 0.05 + 0.95 * t, rotation: (1 - t) * 90, opacity: t };
      case "spiral_in":
        return { ...defaultRes, scale: 0.1 + 0.9 * t, rotation: (1 - t) * 720, opacity: t };
      case "whip_left":
        return { ...defaultRes, x: width * 1.2 * (1 - t), scale: 1.1 - 0.1 * t, opacity: Math.min(1, rawT * 3) };
      case "whip_right":
        return { ...defaultRes, x: -width * 1.2 * (1 - t), scale: 1.1 - 0.1 * t, opacity: Math.min(1, rawT * 3) };
      case "blur_in":
        return { ...defaultRes, opacity: t, filter: `blur(${(1 - t) * 18}px)` };
      case "tv_turn_on": {
        const sY = rawT < 0.4 ? 0.05 : (rawT - 0.4) / 0.6;
        return { ...defaultRes, scale: 0.3 + 0.7 * t, filter: rawT < 0.3 ? "brightness(3)" : "none", opacity: 1 };
      }
      case "flash_in":
        return { ...defaultRes, opacity: t, filter: `brightness(${1 + (1 - rawT) * 4})` };
      case "diag_tl":
        return { ...defaultRes, x: -width * 0.8 * (1 - t), y: -height * 0.8 * (1 - t), opacity: t };
      case "diag_tr":
        return { ...defaultRes, x: width * 0.8 * (1 - t), y: -height * 0.8 * (1 - t), opacity: t };
      case "diag_bl":
        return { ...defaultRes, x: -width * 0.8 * (1 - t), y: height * 0.8 * (1 - t), opacity: t };
      case "diag_br":
        return { ...defaultRes, x: width * 0.8 * (1 - t), y: height * 0.8 * (1 - t), opacity: t };
      case "zoom_rotate":
        return { ...defaultRes, scale: 0.2 + 0.8 * t, rotation: (1 - t) * 90, opacity: t };
      case "glitch_in": {
        const jitter = (1 - rawT) * 15 * (Math.sin(rawT * 40));
        return { ...defaultRes, x: jitter, opacity: rawT > 0.1 ? 1 : 0.4, scale: 0.85 + 0.15 * t };
      }
      default:
        return { ...defaultRes, opacity: t, scale: 0.3 + 0.7 * t };
    }
  }

  // 2. OUT ANIMATION: Active during last `duration` seconds of clip
  if (anim.type === "out") {
    const timeUntilEnd = clipDuration - timeInTrimmedClip;
    if (timeUntilEnd > duration) {
      return defaultRes; // Still playing normally
    }
    const rawT = Math.max(0, Math.min(1, timeUntilEnd / duration)); // 1 when beginning exit, 0 at end
    const t = applyCurve(rawT, anim.curve);

    switch (anim.effect) {
      case "fade_out":
        return { ...defaultRes, opacity: t };
      case "zoom_out_shrink":
        return { ...defaultRes, scale: Math.max(0.01, t), opacity: t };
      case "zoom_out_burst":
        return { ...defaultRes, scale: 1.0 + (1 - t) * 2.5, opacity: t };
      case "slide_out_left":
        return { ...defaultRes, x: -width * (1 - t), opacity: t };
      case "slide_out_right":
        return { ...defaultRes, x: width * (1 - t), opacity: t };
      case "slide_out_up":
        return { ...defaultRes, y: -height * (1 - t), opacity: t };
      case "slide_out_down":
        return { ...defaultRes, y: height * (1 - t), opacity: t };
      case "spin_out_cw":
        return { ...defaultRes, rotation: 360 * (1 - t), scale: Math.max(0.01, t), opacity: t };
      case "spin_out_ccw":
        return { ...defaultRes, rotation: -360 * (1 - t), scale: Math.max(0.01, t), opacity: t };
      case "dissolve_out":
        return { ...defaultRes, opacity: t, filter: `blur(${(1 - t) * 15}px)` };
      case "tv_off": {
        const sY = rawT > 0.5 ? (rawT - 0.5) * 2 : 0.05;
        return { ...defaultRes, scale: Math.max(0.01, rawT), filter: rawT < 0.4 ? "brightness(3)" : "none", opacity: rawT < 0.05 ? 0 : 1 };
      }
      case "flip_x_out":
        return { ...defaultRes, scale: Math.max(0.01, Math.abs(Math.cos((1 - t) * Math.PI / 2))), opacity: t };
      case "whip_exit_l":
        return { ...defaultRes, x: -width * 1.5 * (1 - t), opacity: Math.min(1, rawT * 2) };
      case "whip_exit_r":
        return { ...defaultRes, x: width * 1.5 * (1 - t), opacity: Math.min(1, rawT * 2) };
      case "flash_out":
        return { ...defaultRes, opacity: t, filter: `brightness(${1 + (1 - rawT) * 4})` };
      case "glitch_out": {
        const jitter = (1 - rawT) * 25 * Math.sin((1 - rawT) * 50);
        return { ...defaultRes, x: jitter, scale: Math.max(0.01, t), opacity: rawT < 0.1 ? 0 : 1 };
      }
      default:
        return { ...defaultRes, opacity: t, scale: Math.max(0.01, t) };
    }
  }

  // 3. COMBO ANIMATION: Plays dynamic rhythmic keyframe transformations across duration or cycle
  if (anim.type === "combo") {
    const cycleTime = timeInTrimmedClip % (anim.duration || 1.0);
    const progress = cycleTime / (anim.duration || 1.0);
    const sin1 = Math.sin(progress * Math.PI * 2);
    const sin2 = Math.sin(progress * Math.PI * 4);
    const cos1 = Math.cos(progress * Math.PI * 2);

    switch (anim.effect) {
      case "combo_zoom_pan":
        return {
          ...defaultRes,
          scale: 1.0 + 0.12 * Math.sin(timeInTrimmedClip * 1.5),
          x: Math.sin(timeInTrimmedClip * 1.2) * 25,
          y: Math.cos(timeInTrimmedClip * 0.9) * 15
        };
      case "combo_zoom_shake": {
        const shake = progress < 0.3 ? Math.sin(progress * 40) * 12 : 0;
        return {
          ...defaultRes,
          scale: 1.0 + 0.15 * Math.abs(sin1),
          x: shake,
          y: shake * 0.5
        };
      }
      case "combo_pendulum_1":
      case "combo_pendulum_2":
        return {
          ...defaultRes,
          rotation: sin1 * 12,
          x: sin1 * 20,
          scale: 1.0 + Math.abs(cos1) * 0.05
        };
      case "combo_heartbeat": {
        // Double bump cardiac pulse
        const beatProgress = (timeInTrimmedClip * 1.4) % 1.0;
        let s = 1.0;
        if (beatProgress < 0.15) s = 1.0 + Math.sin((beatProgress / 0.15) * Math.PI) * 0.18;
        else if (beatProgress > 0.25 && beatProgress < 0.4) s = 1.0 + Math.sin(((beatProgress - 0.25) / 0.15) * Math.PI) * 0.12;
        return { ...defaultRes, scale: s };
      }
      case "combo_glitch_hop": {
        const step = Math.floor(progress * 6);
        const jX = (step % 2 === 0 ? 1 : -1) * (step > 0 && step < 3 ? 16 : 0);
        return {
          ...defaultRes,
          x: jX,
          scale: 1.0 + (step === 2 ? 0.15 : 0),
          rotation: jX * 0.4
        };
      }
      case "combo_disco": {
        const bright = (Math.sin(timeInTrimmedClip * 18) > 0.5) ? 1.6 : 1.0;
        return {
          ...defaultRes,
          scale: 1.0 + (bright > 1 ? 0.08 : 0),
          filter: `brightness(${bright})`
        };
      }
      case "combo_earthquake": {
        const t = timeInTrimmedClip;
        const qX = (Math.sin(t * 35) + Math.cos(t * 47)) * 8;
        const qY = (Math.cos(t * 31) + Math.sin(t * 53)) * 6;
        return {
          ...defaultRes,
          x: qX,
          y: qY,
          rotation: Math.sin(t * 20) * 2,
          scale: 1.05
        };
      }
      case "combo_cyber_shake": {
        const t = timeInTrimmedClip;
        const qX = Math.sin(t * 50) * 6;
        const qY = Math.cos(t * 60) * 4;
        return { ...defaultRes, x: qX, y: qY, scale: 1.04 };
      }
      case "combo_wobble":
        return {
          ...defaultRes,
          rotation: Math.sin(timeInTrimmedClip * 5) * 8,
          scale: 1.0 + Math.abs(Math.sin(timeInTrimmedClip * 8)) * 0.1,
          y: Math.sin(timeInTrimmedClip * 8) * -15
        };
      case "combo_velocity_warp": {
        const p = (timeInTrimmedClip * 1.5) % 1.0;
        const s = p < 0.3 ? 1.0 + (p / 0.3) * 0.25 : 1.25 - ((p - 0.3) / 0.7) * 0.25;
        return { ...defaultRes, scale: s };
      }
      case "beat_drop_1":
      case "beat_heavy_bass": {
        const beatP = (timeInTrimmedClip * 2.0) % 1.0;
        const impact = Math.exp(-beatP * 5); // Rapid decay
        return {
          ...defaultRes,
          scale: 1.0 + impact * 0.25,
          y: impact * (Math.sin(beatP * 40) * 8)
        };
      }
      case "beat_strobe_flash": {
        const beatP = (timeInTrimmedClip * 2.0) % 1.0;
        const flash = beatP < 0.12 ? (1 - beatP / 0.12) * 3 : 0;
        return {
          ...defaultRes,
          scale: 1.0 + (flash > 0 ? 0.1 : 0),
          filter: flash > 0 ? `brightness(${1 + flash})` : ""
        };
      }
      case "cam_vertigo": {
        const s = 1.0 + Math.sin(timeInTrimmedClip * 0.8) * 0.25;
        return { ...defaultRes, scale: s };
      }
      case "cam_techno_crane":
        return {
          ...defaultRes,
          y: Math.sin(timeInTrimmedClip * 0.8) * 35,
          x: Math.cos(timeInTrimmedClip * 0.6) * 30,
          rotation: Math.sin(timeInTrimmedClip * 0.5) * 4,
          scale: 1.08
        };
      case "cam_crash_zoom": {
        const p = (timeInTrimmedClip * 0.8) % 1.0;
        const s = p < 0.2 ? 1.0 + (p / 0.2) * 0.4 : 1.4;
        return { ...defaultRes, scale: s };
      }
      default:
        return {
          ...defaultRes,
          scale: 1.0 + 0.08 * sin1,
          x: sin2 * 12,
          rotation: sin1 * 3
        };
    }
  }

  // 4. LOOP & CONTINUOUS ANIMATION: Never stops throughout clip
  if (anim.type === "loop") {
    const t = timeInTrimmedClip;

    switch (anim.effect) {
      case "loop_slow_drift":
        return {
          ...defaultRes,
          scale: 1.0 + Math.sin(t * 0.5) * 0.06,
          x: Math.sin(t * 0.4) * 20,
          y: Math.cos(t * 0.3) * 12,
          rotation: Math.sin(t * 0.2) * 2
        };
      case "loop_push_forward": {
        const progress = (t / Math.max(1, clipDuration));
        return { ...defaultRes, scale: 1.0 + progress * 0.2 };
      }
      case "loop_pull_back": {
        const progress = (t / Math.max(1, clipDuration));
        return { ...defaultRes, scale: 1.2 - progress * 0.2 };
      }
      case "loop_figure_8":
        return {
          ...defaultRes,
          x: Math.sin(t * 1.2) * 30,
          y: Math.sin(t * 2.4) * 18,
          rotation: Math.sin(t * 1.2) * 3,
          scale: 1.05
        };
      case "loop_breathing":
        return {
          ...defaultRes,
          scale: 1.0 + (Math.sin(t * 1.6) * 0.5 + 0.5) * 0.08
        };
      case "loop_handheld": {
        // Multi-frequency organic camera handheld tremor
        const hX = Math.sin(t * 1.7) * 8 + Math.sin(t * 4.3) * 4 + Math.sin(t * 8.1) * 2;
        const hY = Math.cos(t * 1.3) * 6 + Math.cos(t * 3.7) * 3 + Math.sin(t * 9.2) * 1.5;
        const hR = Math.sin(t * 1.1) * 1.8;
        return { ...defaultRes, x: hX, y: hY, rotation: hR, scale: 1.04 };
      }
      case "loop_bass_vib": {
        const vib = Math.sin(t * 45) * 4;
        return { ...defaultRes, y: vib, scale: 1.03 };
      }
      case "loop_neon_pulse": {
        const glow = 1.0 + Math.abs(Math.sin(t * 3)) * 0.6;
        return { ...defaultRes, filter: `brightness(${glow})` };
      }
      case "loop_orbit_tilt":
        return {
          ...defaultRes,
          rotation: Math.sin(t * 0.8) * 8,
          scale: 1.05 + Math.cos(t * 0.8) * 0.04
        };
      case "loop_drone_hover": {
        const dX = Math.sin(t * 0.9) * 14 + Math.sin(t * 2.7) * 4;
        const dY = Math.cos(t * 0.7) * 10 + Math.cos(t * 3.1) * 3;
        return { ...defaultRes, x: dX, y: dY, rotation: dX * 0.1, scale: 1.05 };
      }
      default:
        return {
          ...defaultRes,
          scale: 1.0 + Math.sin(t * 1.0) * 0.05,
          x: Math.sin(t * 0.8) * 15,
          y: Math.cos(t * 0.6) * 10
        };
    }
  }

  return defaultRes;
}

// Math curve interpolation helper
function applyCurve(t: number, curve: AnimationPreset200["curve"]): number {
  const c = Math.max(0, Math.min(1, t));
  switch (curve) {
    case "ease-out":
      return 1 - Math.pow(1 - c, 3);
    case "ease-in":
      return Math.pow(c, 3);
    case "bounce": {
      const n1 = 7.5625;
      const d1 = 2.75;
      let x = c;
      if (x < 1 / d1) return n1 * x * x;
      else if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
      else if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
      else return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
    case "elastic": {
      const c4 = (2 * Math.PI) / 3;
      return c === 0 ? 0 : c === 1 ? 1 : Math.pow(2, -10 * c) * Math.sin((c * 10 - 0.75) * c4) + 1;
    }
    case "snap":
      return Math.pow(c, 0.4);
    case "smooth":
    default:
      return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
  }
}
