import * as THREE from "three";
import {
  OrbitControls,
  EffectComposer,
  RenderPass,
  SMAAPass,
  UnrealBloomPass,
  SkeletonUtils,
  FBXLoader,
  BufferGeometryUtils
} from "three/addons";

class App {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");

    this.DIR_LIGHT_RADIUS = 100;
    this.DIR_LIGHT_INTENSITY = 0.4;
    this.MODELS_PATH = "./assets/models/";
    this.TEXTURES_PATH = "./assets/models/textures/";
    this.SHADERS_PATH = "./shaders/";
    this.POSES_PATH = "./assets/models/poses/";
    this.VOICES_PATH = "./assets/voicelines/";
    this.CHARS = {
      Iuno: {
        msg: "Tap me, please?",
        cameraDistanceAxis: "z",
        cameraDistanceMultiplier: 0.9375,
        parts: [ "Bangs", "Hair", "Face", "Up", "Down", "Alpha", "Eye", "Tacet" ],
        texPrefix: "T_R2T1YounuoMd10011",
        outlineThickness: 0.02875,
        outlineHBI: 0.03,
        hairShine: 0.03,
        startingPose: "Stand",
        posMultiplier: 100,
        startingRot: { x: 8.75, y: -12.25, z: -90 },
        hitboxOffset: { x: 1.75, y: 5, z: -17 },
        headRotAxis: "x",
        voicelines: [
          "play_favor_word_younuo_atk_heavyatk01_01",
          "play_favor_word_younuo_atk_heavyatk01_03",
          "play_favor_word_younuo_com_fly_01",
          "play_favor_word_younuo_com_openbox_01",
          "play_favor_word_younuo_com_openbox_03",
          "play_favor_word_younuo_skill_exitskill_02",
          "play_favor_word_younuo_skill_exitskill_double_02",
          "play_favor_word_younuo_skill_qte_01",
          "play_favor_word_younuo_skill_qte_02",
          "play_favor_word_younuo_skill_qte_03",
          "play_favor_word_younuo_sys_jointeam_01",
          "play_favor_word_younuo_sys_jointeam_02",
        ],
      },
      Galbrena: {
        msg: "Tap me.",
        introVoicelines: [ "play_favor_word_jiabeilina_sys_jointeam_01" ],
        cameraDistanceAxis: "y",
        cameraDistanceMultiplier: 0.9,
        parts: [ "Bangs", "Hair", "Face", "Up", "Down", "Cloth", "Eye", "Tacet" ],
        texPrefix: "T_R2T1CalbrenaMd10011",
        outlineThickness: 5e-4,
        outlineHBI: 0.03,
        hairShine: 0.03,
        startingPose: "Hand-on-Hip",
        posMultiplier: 1,
        startingRot: { x: -160, y: 195, z: 0 },
        hitboxOffset: { x: 6, y: -78, z: -113 },
        headRotAxis: "y",
        voicelines: [ "play_favor_word_jiabeilina_com_openbox_03", "play_favor_word_jiabeilina_com_openbox_03_02", "play_favor_word_jiabeilina_sys_gacha", "play_favor_word_jiabeilina_sys_rankup03" ],
      },
      Denia: {
        msg: "Go ahead, tap me~",
        introVoicelines: [ "937", "600-2", "905-1" ],
        cameraDistanceAxis: "z",
        cameraDistanceMultiplier: 1.1,
        parts: [ "Bangs", "Hair", "Face", "Up", "Down", "Cloth", "Fur", "Eye" ],
        texPrefix: "T_R2T1DaniyaMd10011",
        outlineThickness: 4375e-7,
        outlineHBI: 0.7,
        hairShine: 0.07,
        startingPose: "Stand",
        posMultiplier: 1,
        startingRot: { x: 0, y: 0, z: 0 },
        hitboxOffset: { x: 1, y: 86, z: -95 },
        headRotAxis: "x",
        flipIsFacingCamera: true,
        voicelines: [
          "015-1",
          "015-2",
          "063",
          "070-1",
          "070-2",
          "138",
          "176",
          "226",
          "238",
          "326",
          "432",
          "507-1",
          "507-2",
          "507-3",
          "527",
          "543",
          "570",
          "574",
          "600-1",
          "600-3",
          "662",
          "673",
          "863",
          "905-2",
        ],
      },
      Denia_2: {
        msg: "Tap me.",
        introVoicelines: null,
        cameraDistanceMultiplier: 1.15,
        parts: [ "Face", "Cloth", "Fx", "Eye", "Bangs", "Hair", "Up", "Down" ],
        startingPose: "Arms-Crossed",
        startingRot: { x: 23, y: 0, z: 0 },
        hitboxOffset: { x: 2, y: 82.5, z: -90 },
        voicelines: [
          "138",
          "226",
          "527",
          "673",
          "025",
          "222",
          "270",
          "356",
          "361",
          "384",
          "396",
          "517",
          "589",
          "794",
          "985",
          "997",
        ],
      },
      Denia_3: {
        cameraDistanceMultiplier: 1.175,
        parts: [ "Body", "Cloth", "Fx", "Hair", "Eye", "Bangs", "Face", "Down" ],
        startingPose: "Hand-on-Hip",
        hitboxOffset: { x: -95, y: 86, z: -96 },
        headRotAxis: "y",
        headRotAxisUpDown: "x",
        inheritVoicelines: true,
        inheritBGM: true,
      },
    };
    this.PALETTES = [
      {
        lightTint: 0xFFCFB4,
        ambientTint: 0xFFF3B8,
        rimTint: 0xFFCF14,
        shadowTint: 0xE2C6D9,
        tintStrength: 3
      },
      {
        lightTint: 0xFFCFB4,
        ambientTint: 0xFFFFFF,
        rimTint: 0xFFD356,
        shadowTint: 0xE8F273,
        tintStrength: 1
      },
      {
        lightTint: 0xFFBA78,
        ambientTint: 0xFFF3B4,
        rimTint: 0xFFB99C,
        shadowTint: 0xE4D833,
        tintStrength: 2.75
      },
      {
        lightTint: 0xE6D0FF,
        ambientTint: 0xF6F1FF,
        rimTint: 0xBAFFFF,
        shadowTint: 0xF3E3FF,
        tintStrength: 2
      }
    ];
    this.BLINK_DUR = 0.133;
    this.EYE_MAX_X = 0.5;
    this.EYE_MAX_Y = 0.333;
    this.HEAD_MAX_X = THREE.MathUtils.degToRad(15);
    this.HEAD_MAX_Y = THREE.MathUtils.degToRad(45);
    this.cachedMats = [];
    this.existingModels = [];
    this.lerp = THREE.MathUtils.lerp;
    this.followMouseLerp = 0.15;
    this.blinkDur = 0.13333;
    this.blinkWeights = [ 1.2, 0.375, 1.5 ];
    this.lastBlink = 0;
    this.blinkInterval = 0;
  }
  
  resolveChars() {
    for (const [ name, charConfig ] of Object.entries(this.CHARS)) {
      const parts = name.split("_");

      if (isNaN(parts.pop())) {
        this.CHARS[ name ].voicelinesPath = name;
        this.CHARS[ name ].bgmClass = name.toLowerCase();
        continue;
      }

      const baseName = parts.join("_");

      this.CHARS[ name ] = {
        ...this.CHARS[ baseName ],
        ...charConfig
      };

      this.CHARS[ name ].voicelinesPath =
        this.CHARS[ name ].inheritVoicelines
          ? baseName
          : name;

      this.CHARS[ name ].bgmClass =
        (
          this.CHARS[ name ].inheritBGM
            ? baseName
            : name
        ).toLowerCase();
    }
  }

  beginLoadingScreen() {
    const loadingText = this.loadingScreen.querySelector(".loading-text");
    const loading1 = loadingText.querySelector("#loading-1");
    const loading2 = loadingText.querySelector("#loading-2");
    this.loadingId = setInterval(() => {
      loadingText.classList.add("animate");
      setTimeout(() => {
        loadingText.classList.remove("animate");
        [ loading1.innerText, loading2.innerText ] = [ loading2.innerText, loading1.innerText ];
        loading1.classList.toggle("dot");
      }, 400);
    }, 5000);
  }

  hideLoadingScreen() {
    clearInterval(this.loadingId);
    this.loadingId = null;
    setTimeout(() => {
      this.loadingScreen.classList.add("done-loading");
      document.querySelector("#tap-me img").classList.add("shake");
      document.addEventListener("click",
        () => {
          this.isFullyVisible = true;
          this.bgm.play();
          document.querySelector("#tap-me").classList.add("tapped");
          this.setupMouseDown.playVoiceline(true, true);
        },
        { once: true }
      );
    }, 100);
  }

  async updatePageForChar(charName = "", clickElement = null) {
    // Save current character if switching to a new one
    if (charName) {
      this.existingModels[ this.charName ] = [
        this.char,
        this.clone,
        this.hitbox,
        this.mesh,
        this.cMesh
      ];
      // Capitalize first letter of new character name
      this.charName = charName.charAt(0).toUpperCase() + charName.slice(1);
    } else {
      // Determine character from URL parameters or hostname
      const urlParams = new URLSearchParams(location.search);
      this.charName =
        urlParams.get("character") ||
        urlParams.get("char") ||
        new URL(location.origin).hostname.split(".")[ 0 ];

      // Capitalize the name
      this.charName = this.charName
        ? this.charName[ 0 ].toUpperCase() + this.charName.slice(1)
        : "";

      // Validate character exists, default to Denia if not
      this.charName = this.CHARS[ this.charName ] ? this.charName : "Denia";
    }

    // Get character config from CHARS dictionary
    this.activeChar = this.CHARS[ this.charName ];

    // Set skin/texture prefix based on character
    switch (this.charName) {
      case "Galbrena":
        // If Galbrena-2 variant exists, use its textures
        if (document.querySelector(".galbrena-2")) {
          this.skin = [ "Galbrena-2", "T_NHT1CalbrenaChaopin" ];
          break;
        }
      default:
        // Use default skin for character
        this.skin = [ this.charName, this.activeChar.texPrefix ];
    }

    // If called without charName (initial load), update UI only
    if (!charName) {
      document.body.setAttribute("data-char", this.charName);

      // Update UI images and text to match character
      const charPrefix = this.charName.split("_")[ 0 ];
      const tapMeImg = document.querySelector("#tap-me img");
      tapMeImg.src = tapMeImg.src.replace("Denia", charPrefix);
      tapMeImg.alt = tapMeImg.alt.replace("Denia", charPrefix);

      // Update tap text
      document.querySelector("#tap-me span").innerText = this.activeChar.msg;

      // Update favicon
      const favicon = document.querySelector('link[rel="icon"]');
      favicon.href = favicon.href.replace("Denia", charPrefix);

      // Set background music
      this.bgm = document.querySelector(".bgm." + this.activeChar.bgmClass);
      this.bgm.volume = this.bgm.getAttribute("data-vol");
      return;
    }

    // Character switch: hide current models
    this.char.visible = false;
    this.clone.visible = false;
    this.hitbox.visible = false;

    // Try to show cached model, or load new one
    const modelLoaded = await this.showExistingModel();
    if (!modelLoaded) {
      // Add loading indicator
      clickElement?.closest(".switch-char")?.classList.add("loading");

      // Load new 3D model
      await this.setupModel(false, true);

      // Remove loading indicator
      clickElement?.closest(".switch-char")?.classList.remove("loading");
    }

    // Update page data attribute
    document.body.setAttribute("data-char", this.charName);

    // Handle music crossfade if music was playing
    let previousBGM = null;
    let wasMusicPlaying = false;

    if (charName && !this.bgm.paused) {
      wasMusicPlaying = true;
      previousBGM = this.bgm;
    }

    // Switch to new character's background music
    this.bgm = document.querySelector(".bgm." + this.activeChar.bgmClass);

    // Crossfade if music track changed
    if (this.bgm !== previousBGM) {
      this.bgm.volume = this.bgm.getAttribute("data-vol");
      if (wasMusicPlaying) {
        await this.crossfadeTracks(previousBGM, this.bgm);
      }
    }
  }

  async crossfadeTracks(fromTrack, toTrack, fadeDuration = 0.3) {
    return new Promise((resolve) => {
      const startTime = performance.now();
      const fromVolume = fromTrack.volume;
      const toVolume = toTrack.volume;

      toTrack.volume = 0;
      toTrack.play();

      const animateFrame = () => {
        const elapsedSeconds = (performance.now() - startTime) / (1000 * fadeDuration);
        const progress = Math.min(Math.max(elapsedSeconds, 0), 1);

        fromTrack.volume = fromVolume * (1 - progress);
        toTrack.volume = toVolume * progress;

        if (progress < 1) {
          requestAnimationFrame(animateFrame);
        } else {
          fromTrack.pause();
          fromTrack.volume = fromVolume;
          toTrack.volume = toVolume;
          resolve();
        }
      };
      animateFrame();
    });
  }

  setupThree() {
    // Create scene and camera
    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight
    );
    this.scene.add(this.camera);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Get canvas and insert into DOM
    this.canvas = this.renderer.domElement;
    document.querySelector(".menu").insertAdjacentElement("afterend", this.canvas);

    // Setup controls
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.PAN,
      RIGHT: THREE.MOUSE.PAN
    };

    // Setup lighting
    this.dirLight = new THREE.DirectionalLight(
      0xFFFFFF,
      this.useThreeMat ? 1 : this.DIR_LIGHT_INTENSITY
    );
    this.ambientLight = new THREE.AmbientLight(0xFFFFFF);
    this.scene.add(this.dirLight, this.ambientLight);

    // Setup directional light helper (debug)
    this.dirLightHelper = new THREE.DirectionalLightHelper(this.dirLight, 10, 0xFFFFFF);
    this.dirLightHelper.visible = false;
    this.scene.add(this.dirLightHelper);
  }

  loadTex(texturePath, colorSpace = THREE.SRGBColorSpace) {
    return new Promise((resolve) => {
      new THREE.TextureLoader().load(
        texturePath,
        (texture) => {
          texture.colorSpace = colorSpace;
          resolve(texture);
        },
        undefined,
        () => resolve(null)
      );
    });
  }

  async applyMats(useThreeMat = null, returnOnly = false) {
    useThreeMat = useThreeMat !== null ? useThreeMat : this.useThreeMat;

    // Check if materials are already cached
    const cachedMaterials = this.cachedMats[ `${this.skin[ 0 ]}${useThreeMat}` ] || [];
    if (cachedMaterials.length > 1) {
      return void (this.mesh.material = cachedMaterials);
    }

    // Set palette based on time of day
    const currentHour = new Date().getHours();
    if (this.paletteIndex === undefined) {
      this.paletteIndex = currentHour > 6 && currentHour < 18 ? 2 : 3;
    }
    const palette = this.PALETTES[ this.paletteIndex ];

    const materials = [];

    for (const part of this.activeChar.parts) {
      // If using Three.js material (simpler rendering)
      if (useThreeMat) {
        materials.push(
          new THREE.MeshStandardMaterial({
            map:
              (await this.loadTex(`${this.TEXTURES_PATH}${this.skin[ 0 ]}/${this.skin[ 1 ]}${part}_D.png`)) ||
              (await this.loadTex(`${this.TEXTURES_PATH}${this.charName}/${this.activeChar.texPrefix}${part}_D.png`)),
          })
        );
        continue;
      }

      // Custom shader uniforms for advanced rendering
      const uniforms = {
        morphTextureStride: { value: 1 },
        base: {
          value:
            part === "Fur"
              ? null
              : await this.loadTex(`${this.TEXTURES_PATH}${this.skin[ 0 ]}/${this.skin[ 1 ]}${part}_D.png`),
        },
        aCutoff: { value: 0 },
        gCutoff: { value: 0 },
        isFur: { value: false },
        hasOutlineMask: { value: false },
        hasNRM: { value: false },
        hasFTM: { value: false },
        lightTint: { value: new THREE.Color(palette.lightTint) },
        rimTint: { value: new THREE.Color(palette.rimTint) },
        ambientTint: { value: new THREE.Color(palette.ambientTint) },
        shadowTint: { value: new THREE.Color(palette.shadowTint) },
        tintStrength: { value: palette.tintStrength },
        specularExp: { value: 10 },
        rimLightThreshold: { value: 0.2 },
        rimThreshold: { value: 0.7 },
        metallicBrightness: { value: 1 },
        exposure: { value: 0.5 },
        invGamma: { value: 1 / 1.55 },
        saturation: { value: 1 },
        hairSaturation: { value: 1 },
        isFace: { value: false },
        isEye: { value: false },
        isHair: { value: false },
        hasMilkway: { value: false },
        shouldGlowRed: { value: false },
        isDeniaChest: { value: false },
        sparkleTiling: { value: 4 },
        invSparkleTiling: { value: 0 },
        hasFX: { value: false },
        outlineLightInfluence: { value: 0.667 },
        outlineBurnIntensity: { value: 1 },
        outlineMaxBrightness: { value: 0.25 },
        isOutline: { value: false },
      };

      // Part-specific uniforms
      switch (part) {
        case "Face":
          uniforms.isFace = { value: true };
          uniforms.het = {
            value: await this.loadTex(`${this.TEXTURES_PATH}${this.skin[ 0 ]}/${this.skin[ 1 ]}${part}_EyebrowsHET.png`),
          };
          uniforms.faceSDF = { value: await this.loadTex(`${this.TEXTURES_PATH}T_FemaleMFace01_SDF.png`) };
          uniforms.outlineMask = { value: await this.loadTex(`${this.TEXTURES_PATH}Face_OutlineMask.png`) };
          break;

        case "Eye":
          uniforms.isEye = { value: true };
          uniforms.eyeHighlight = { value: await this.loadTex(`${this.TEXTURES_PATH}T_Highlight_1.webp`) };
          uniforms.eyeBottomHighlight = { value: await this.loadTex(`${this.TEXTURES_PATH}BottomHighlight_1.webp`) };
          break;

        case "Hair":
        case "Bangs":
          uniforms.isHair = { value: true };
          uniforms.hairHM = {
            value: await this.loadTex(`${this.TEXTURES_PATH}${this.charName}/${this.activeChar.texPrefix}${part}_HM.png`),
          };
          uniforms.hairShine = { value: this.activeChar.hairShine };
          if (Object.hasOwn(this.activeChar, "outlineHBI")) {
            uniforms.outlineBurnIntensity = { value: this.activeChar.outlineHBI };
          }
          break;

        case "Fur":
          uniforms.isFur = { value: true };
          uniforms.base = { value: await this.loadTex(`${this.TEXTURES_PATH}T_Fur_M.png`) };
          break;

        case "Up":
        case "Down":
        case "Cloth":
        case "Alpha":
          switch (this.charName) {
            case "Denia_3":
              break;
            case "Denia":
            case "Denia_2":
              uniforms.ftm = {
                value: await this.loadTex(`${this.TEXTURES_PATH}${this.skin[ 0 ]}/${this.skin[ 1 ]}${part}_FTM.png`),
              };
            default:
              uniforms.nrm = {
                value: await this.loadTex(`${this.TEXTURES_PATH}${this.skin[ 0 ]}/${this.skin[ 1 ]}${part}_N.png`),
              };
          }
      }

      // Character-specific shader settings
      let cubemapPath = `${this.TEXTURES_PATH}CharacterCubeMaps/T_MC_premake`;

      switch (this.charName) {
        case "Denia":
          switch (part) {
            case "Up":
              uniforms.gCutoff = { value: 0.55 };
              break;
            case "Cloth":
              uniforms.outlineMask = {
                value: await this.loadTex(`${this.TEXTURES_PATH}${this.skin[ 0 ]}/${this.skin[ 1 ]}${part}_OutlineMask.png`),
              };
              uniforms.hasMilkway = { value: true };
              uniforms.sparkleTiling = { value: 10 };
              break;
            case "Hair":
              uniforms.hasFX = { value: true };
              uniforms.invSparkleTiling = { value: 1 / 6 };
              break;
            case "Down":
              uniforms.hasFX = { value: true };
              uniforms.hasMilkway = { value: true };
              uniforms.sparkleTiling = { value: 10 };
          }
          break;

        case "Denia_2":
          switch (part) {
            case "Fx":
              uniforms.aCutoff = { value: 0.8 };
              uniforms.hasMilkway = { value: true };
              uniforms.isDeniaChest = { value: true };
              break;
            case "Up":
              uniforms.gCutoff = { value: 0.55 };
              uniforms.hasMilkway = { value: true };
              uniforms.shouldGlowRed = { value: true };
              break;
            case "Cloth":
              uniforms.hasMilkway = { value: true };
              uniforms.sparkleTiling = { value: 10 };
              break;
            case "Hair":
              uniforms.hasFX = { value: true };
              uniforms.invSparkleTiling = { value: 1 / 6 };
              break;
            case "Down":
              uniforms.hasFX = { value: true };
              uniforms.hasMilkway = { value: true };
              uniforms.sparkleTiling = { value: 10 };
          }
          break;

        case "Denia_3":
          switch (part) {
            case "Body":
              uniforms.gCutoff = { value: 0.55 };
              break;
            case "Fx":
              uniforms.aCutoff = { value: 0.8 };
              uniforms.hasMilkway = { value: true };
              uniforms.isDeniaChest = { value: true };
              break;
            case "Cloth":
              uniforms.hasMilkway = { value: true };
              uniforms.sparkleTiling = { value: 10 };
          }
      }

      // Load additional textures based on flags
      if (uniforms.outlineMask) {
        uniforms.hasOutlineMask.value = true;
      }
      if (uniforms.ftm) {
        uniforms.hasFTM.value = true;
      }
      if (uniforms.nrm) {
        uniforms.hasNRM.value = true;
        uniforms.metallicMatCap = { value: await this.loadTex(`${cubemapPath}_D.png`) };
      }

      // Load milky way / sparkle textures
      if (uniforms.hasMilkway.value) {
        const milkwayTex = await this.loadTex(
          `${this.TEXTURES_PATH}T_Wenli_${part === "Cloth" ? 230046 : 10025}.png`
        );
        const sparkleTex = await this.loadTex(`${this.TEXTURES_PATH}T_Sparkle_SDF.png`);

        milkwayTex.wrapS = milkwayTex.wrapT = sparkleTex.wrapS = sparkleTex.wrapT = THREE.RepeatWrapping;
        uniforms.milkway = { value: milkwayTex };
        uniforms.sparkle = { value: sparkleTex };

        if (!uniforms.isDeniaChest.value) {
          uniforms.milkwayMask = {
            value: await this.loadTex(
              `${this.TEXTURES_PATH}${this.charName}/${this.activeChar.texPrefix}${part}_MilkwayMask.png`
            ),
          };
        }
      }

      // Load FX textures
      if (uniforms.hasFX.value) {
        const fxTex = await this.loadTex(
          `${this.TEXTURES_PATH}${this.charName}/${this.activeChar.texPrefix}${part}_FX.png`
        );
        fxTex.wrapS = fxTex.wrapT = THREE.RepeatWrapping;
        uniforms.fx = { value: fxTex };

        if (uniforms.sparkleTiling.value > 0) {
          const sparkleTex = await this.loadTex(`${this.TEXTURES_PATH}T_Sparkle_SDF.png`);
          sparkleTex.wrapS = sparkleTex.wrapT = THREE.RepeatWrapping;
          uniforms.sparkle = { value: sparkleTex };
        }
      }

      // Create shader material
      const shaderMaterial = new THREE.ShaderMaterial({
        lights: true,
        uniforms: Object.assign(Object.assign({}, THREE.UniformsLib.lights), uniforms),
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        defines: {
          USE_UV: '',
          USE_UV2: ''
        },
      });

      // Fur needs special settings
      if (part === "Fur") {
        shaderMaterial.transparent = true;
        shaderMaterial.side = THREE.DoubleSide;
        shaderMaterial.depthWrite = false;
      }

      materials.push(shaderMaterial);
    }

    // Cache materials
    this.cachedMats[ `${this.skin[ 0 ]}${useThreeMat}` ] = materials;

    // Return materials if returnOnly flag set
    if (returnOnly) return materials;

    // Apply to mesh
    this.mesh.material = materials;
  }

  updatePalette(palette) {
    if (!this.useThreeMat) {
      const paletteUniforms = {
        tintStrength: { value: palette.tintStrength },
        lightTint: { value: new THREE.Color(palette.lightTint) },
        rimTint: { value: new THREE.Color(palette.rimTint) },
        ambientTint: { value: new THREE.Color(palette.ambientTint) },
        shadowTint: { value: new THREE.Color(palette.shadowTint) },
      };

      // Update shader uniforms for all materials
      for (const materialIndex in this.mesh.material) {
        Object.assign(this.mesh.material[ materialIndex ].uniforms, paletteUniforms);

        if (this.cMesh.material[ materialIndex ].uniforms) {
          Object.assign(this.cMesh.material[ materialIndex ].uniforms, paletteUniforms);
        }
      }
    }
  }

  async switchSkin(skinName, texPrefix, partsToSwap) {
    this.skin = [ skinName, texPrefix ];

    // Check if skin materials are already cached
    let skinMaterials = this.cachedMats[ `${skinName}${this.useThreeMat}` ];
    let outlineMaterials = [];

    if (skinMaterials) {
      // Use cached materials
      this.mesh.material = skinMaterials;
      this.cMesh.material = this.cachedMats[ `${skinName}Outlines` ];
      return;
    }

    // Clone existing character materials as base
    skinMaterials = this.cachedMats[ `${this.charName}${this.useThreeMat}` ].map((mat) => mat.clone());
    outlineMaterials = this.cachedMats[ `${this.charName}Outlines` ].map((mat) => mat.clone());

    // Update textures for specified parts
    const characterParts = this.activeChar.parts;
    for (const partIndex in characterParts) {
      const partName = characterParts[ partIndex ];

      // Only update parts that are in partsToSwap
      if (!partsToSwap.includes(partName)) continue;

      // Load new texture for this part
      const newTexture = await this.loadTex(`${this.TEXTURES_PATH}${skinName}/${texPrefix}${partName}_D.png`);

      // Update main mesh material
      Object.assign(skinMaterials[ partIndex ].uniforms, { base: { value: newTexture } });

      // Update outline mesh material (except for eyes)
      if (partName !== "Eye") {
        Object.assign(outlineMaterials[ partIndex ].uniforms, { base: { value: newTexture } });
      }
    }

    // Apply new materials to meshes
    this.mesh.material = skinMaterials;
    this.cMesh.material = outlineMaterials;

    // Cache for future use
    this.cachedMats[ `${skinName}${this.useThreeMat}` ] = skinMaterials;
    this.cachedMats[ `${skinName}Outlines` ] = outlineMaterials;
  }

  async setupModel(useThreeMat = false, initMouseFollow = false) {
    // Initialize useThreeMat if not already set
    if (this.useThreeMat === undefined) {
      this.useThreeMat = useThreeMat;
    }

    // Initialize FBX loader
    if (!this.fbxLoader) {
      this.fbxLoader = new FBXLoader();
    }

    // Load 3D model
    this.char = await new Promise((resolve, reject) => {
      this.fbxLoader.load(
        `${this.MODELS_PATH}${this.charName}.fbx`,
        model => resolve(model),
        undefined,
        error => reject(error)
      );
    });

    // Get the skinned mesh from the model
    this.mesh = this.char.getObjectByProperty("type", "SkinnedMesh");

    let geometry = this.mesh.geometry;

    // Detect mobile devices and simplify geometry if needed
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice =
      userAgent.includes("phone") ||
      userAgent.includes("mobile") ||
      userAgent.includes("ipod") ||
      userAgent.includes("blackberry") ||
      userAgent.includes("palm") ||
      userAgent.includes("windows ce") ||
      userAgent.includes("opera mini") ||
      userAgent.includes("avantgo") ||
      userAgent.includes("docomo") ||
      userAgent.includes("kaios");

    if (isMobileDevice) {
      this.mesh.geometry = BufferGeometryUtils.mergeVertices(geometry);
    }

    // Remove unnecessary morph targets (eye pupils)
    this.pruneMorphTargets(this.mesh, new Set([ "Pupil_Up", "Pupil_Down", "Pupil_R", "Pupil_L" ]));
    this.mesh.updateMatrixWorld(true);

    // Position camera based on model size
    const boundingBox = new THREE.Box3().setFromObject(this.char);
    const modelSize = boundingBox.getSize(new THREE.Vector3());
    this.camera.position.z =
      modelSize[ this.activeChar.cameraDistanceAxis ] * this.activeChar.cameraDistanceMultiplier;

    // Apply materials and textures
    await this.applyMats();

    // Load and apply starting pose
    const skeleton = this.mesh.skeleton;
    if (this.activeChar.startingPose) {
      const poseData = await (
        await fetch(`${this.POSES_PATH}${this.charName}/${this.activeChar.startingPose}.json`)
      ).json();

      for (const [ boneName, boneTransform ] of Object.entries(poseData)) {
        const bone = skeleton.getBoneByName(boneName);
        if (bone) {
          bone.position.fromArray(boneTransform.position).multiplyScalar(this.activeChar.posMultiplier);
          bone.quaternion.fromArray(boneTransform.quaternion);
          bone.scale.fromArray(boneTransform.scale);
        }
      }
    }

    // Apply starting rotation to pelvis bone
    const pelvisBone = skeleton.getBoneByName("Bip001Pelvis") || skeleton.getBoneByName("腰");
    const startingRotation = this.activeChar.startingRot;
    pelvisBone.rotateZ(THREE.MathUtils.degToRad(startingRotation.z));
    pelvisBone.rotateX(THREE.MathUtils.degToRad(startingRotation.x));
    pelvisBone.rotateY(THREE.MathUtils.degToRad(startingRotation.y));

    // Function to update light and camera to follow head
    const updateLightAndCamera = () => {
      const neckBone = this.mesh.skeleton.getBoneByName("Bip001Neck") || this.mesh.skeleton.getBoneByName("首");
      const neckPosition = new THREE.Vector3();
      neckBone.getWorldPosition(neckPosition);

      // Position directional light above character's head
      this.dirLight.position.set(
        neckPosition.x,
        neckPosition.y,
        neckPosition.z + this.DIR_LIGHT_RADIUS
      );
      this.dirLight.target.position.copy(neckPosition);

      // Add light target to scene if not already there
      if (!this.scene.children.includes(this.dirLight.target)) {
        this.scene.add(this.dirLight.target);
      }

      // Center camera and controls on character's head
      this.camera.position.x = neckPosition.x;
      this.camera.position.y = neckPosition.y;
      this.controls.target.copy(neckPosition);
      this.controls.update();
    };

    // Store function as method for later updates
    this.setupModel.posLightAndCam = updateLightAndCamera;
    updateLightAndCamera();

    // Add character to scene
    this.scene.add(this.char);

    // Create simplified mesh for raycasting (hitbox)
    this.hitbox = this.simplifyMesh(this.mesh);

    // Apply hitbox offset from character config
    for (const [ axis, offset ] of Object.entries(this.activeChar.hitboxOffset)) {
      this.hitbox.position[ axis ] += offset;
    }

    // Rotate hitbox for Denia variants
    if (this.charName.startsWith("Denia")) {
      this.hitbox.rotateX(THREE.MathUtils.degToRad(90));
    }

    this.hitbox.updateMatrixWorld(true);
    this.scene.add(this.hitbox);

    // Create outline clone for character edges
    this.createOutlineClone();

    // Initialize mouse following if requested
    if (initMouseFollow) {
      this.setupMouseFollow.init();
    }

    // Play intro voiceline if not using simplified materials
    if (!this.useThreeMat) {
      this.setupMouseDown.playVoiceline?.(true, true);
    }
  }

  pruneMorphTargets(mesh, targetsToKeep) {
    const morphAttributes = mesh.geometry.morphAttributes.position;
    const morphTargetDictionary = mesh.morphTargetDictionary;

    // Create empty buffer attribute to replace unused morph targets
    const emptyBuffer = new THREE.BufferAttribute(
      new Float32Array(mesh.geometry.attributes.position.array.length),
      3
    );

    // Iterate through all morph targets
    for (const targetName in morphTargetDictionary) {
      // Keep targets in the targetsTKeep set
      if (targetsToKeep.has(targetName)) continue;

      // Get the morph target buffer
      const morphBuffer = morphAttributes[ morphTargetDictionary[ targetName ] ];

      // Replace with empty buffer
      morphAttributes[ morphTargetDictionary[ targetName ] ] = emptyBuffer;

      // Clear the array data
      if (morphBuffer && morphBuffer.array) {
        morphBuffer.array = null;
      }
    }

    // Flag geometry as needing update
    mesh.geometry.needsUpdate = true;
  }

  simplifyMesh(mesh, simplificationRatio = 0.6) {
    const positionAttribute = mesh.geometry.attributes.position;
    const vertexCount = positionAttribute.count;

    // Calculate step size (higher ratio = fewer vertices)
    const step = Math.max(1, Math.floor(1 / simplificationRatio));

    // Create array for simplified vertices
    const simplifiedPositions = new Float32Array(3 * Math.ceil(vertexCount / step));
    let positionIndex = 0;

    // Calculate center/average of all vertices
    const vertex = new THREE.Vector3();
    const center = new THREE.Vector3();

    for (let i = 0; i < vertexCount; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      center.add(vertex);
    }
    center.divideScalar(vertexCount);

    // Sample vertices at intervals and transform them
    for (let i = 0; i < vertexCount; i += step) {
      vertex.fromBufferAttribute(positionAttribute, i);

      // Center the vertex
      vertex.sub(center);

      // Apply rotation (flip around X axis by -90 degrees)
      vertex.applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

      // Move back to world position
      vertex.add(center);

      // Apply mesh's world transform
      vertex.applyMatrix4(mesh.matrixWorld);

      // Store in simplified array
      simplifiedPositions[ positionIndex++ ] = vertex.x;
      simplifiedPositions[ positionIndex++ ] = vertex.y;
      simplifiedPositions[ positionIndex++ ] = vertex.z;
    }

    // Create new geometry from simplified vertices
    const simplifiedGeometry = new THREE.BufferGeometry();
    simplifiedGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(simplifiedPositions, 3)
    );

    // Create invisible mesh for raycasting (hitbox)
    return new THREE.Mesh(
      simplifiedGeometry,
      new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        visible: false
      })
    );
  }

  async createOutlineClone() {
    this.clone = SkeletonUtils.clone(this.char);

    const skinnedMesh = this.clone.getObjectByProperty(
      "type",
      "SkinnedMesh"
    );

    skinnedMesh.updateMatrixWorld(true);

    skinnedMesh.bind(
      this.mesh.skeleton,
      skinnedMesh.matrixWorld
    );

    // Reuse cached outline materials if available.
    let materials = this.cachedMats[
      this.charName + "Outlines"
    ];

    if (materials) {
      skinnedMesh.material = materials;
      return;
    }

    // Clone the character's materials.
    materials = (
      this.cachedMats[ this.charName + "false" ] ||
      (await this.applyMats(false, true))
    ).map((material) => material.clone());

    const parts = this.activeChar.parts;

    for (const index in materials) {
      const part = parts[ index ];

      if (
        part !== "Eye" &&
        part !== "Tacet" &&
        part !== "Fur"
      ) {
        const material = materials[ index ];

        material.side = THREE.BackSide;
        material.transparent = true;

        material.uniforms.isOutline = {
          value: true
        };

        material.uniforms.outlineThickness = {
          value:
            part === "Bangs"
              ? this.activeChar.outlineThickness
              : 675e-6 * this.activeChar.posMultiplier
        };
      } else {
        materials[ index ] = new THREE.MeshBasicMaterial({
          visible: false
        });
      }
    }

    skinnedMesh.material = materials;
    this.cachedMats[ this.charName + "Outlines" ] = materials;
    this.cMesh = skinnedMesh;
    this.clone.visible = !this.useThreeMat;
    this.scene.add(this.clone);
  }

  async showExistingModel() {
    const existingModel = this.existingModels[ this.charName ];

    if (!existingModel) {
      return false;
    }

    this.char = existingModel[ 0 ];
    this.clone = existingModel[ 1 ];
    this.hitbox = existingModel[ 2 ];
    this.mesh = existingModel[ 3 ];
    this.cMesh = existingModel[ 4 ];

    const boundingBox = new THREE.Box3().setFromObject(this.char);
    const modelSize = boundingBox.getSize(new THREE.Vector3());

    this.camera.position.z =
      modelSize[ this.activeChar.cameraDistanceAxis ] *
      this.activeChar.cameraDistanceMultiplier;

    await this.applyMats();

    this.setupModel.posLightAndCam();
    this.setupMouseFollow.init();

    this.inf[ this.dict.E_Close ] = 0;

    for (const direction of [ "_L", "_R", "_Up", "_Down" ]) {
      this.inf[ this.dict[ "Pupil" + direction ] ] = 0;
    }

    this.updatePalette(
      this.PALETTES[ this.paletteIndex ]
    );

    await new Promise((resolve) => {
      requestAnimationFrame(resolve);
    });

    this.char.visible = true;
    this.hitbox.visible = true;
    this.clone.visible = !this.useThreeMat;

    if (!this.useThreeMat && this.setupMouseDown.playVoiceline) {
      this.setupMouseDown.playVoiceline(true, true);
    }

    return true;
  }

  async init() {
    this.resolveChars();
    this.beginLoadingScreen();
    document.addEventListener("click", () => (this.hasInteracted = true), { once: true });
    this.updatePageForChar();
    this.setupThree();
    this.vertexShader = await fetch(this.SHADERS_PATH + "vertexShader.glsl");
    this.vertexShader = await this.vertexShader.text();
    this.fragmentShader = await fetch(this.SHADERS_PATH + "fragmentShader.glsl");
    this.fragmentShader = await this.fragmentShader.text();
    this.useThreeMat = false;
    await this.setupModel();
    this.postprocessing();
    this.renderer.compile(this.scene, this.camera);
    this.addEventListeners();
    this.timer = new THREE.Timer();
    this.timer.connect(document);
    this.animateBound = this.animate.bind(this);
    this.animate();
    this.hideLoadingScreen();
  }

  postprocessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.275, 0.95, 0.4
    );
    this.bloomPass.renderToScreen = false;
    this.composer.addPass(this.bloomPass);
    const smaaPass = new SMAAPass();
    smaaPass.renderToScreen = true;
    this.composer.addPass(smaaPass);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  addEventListeners() {
    this.setupMouseDown();
    this.setupMouseFollow();

    // One-time touch start: reduce lerp speed and disable mouse tracking
    document.addEventListener(
      "touchstart",
      () => {
        this.followMouseLerp *= 0.5;
        window.removeEventListener("mousemove", this.updateMouseBound);
      },
      { once: true }
    );

    // Store initial touch position
    document.addEventListener("touchstart", () => {
      this.lastMx = this.mx;
      this.lastMy = this.my;
      this.doNotFollowTouch = false;
    });

    // Mark as swiping (dragging) when touch moves
    document.addEventListener("touchmove", () => {
      this.doNotFollowTouch = true;
    });

    // Update mouse position on touch end (unless swiping)
    document.addEventListener("touchend", (event) => {
      if (!this.doNotFollowTouch) {
        this.updateMouse(event);
      }
    });

    // Pause/resume music when tab visibility changes
    let wasMusicPlaying = false;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") {
        // Tab hidden
        if (this.bgm && !this.bgm.paused) {
          this.bgm.pause();
          wasMusicPlaying = true;
        } else {
          wasMusicPlaying = false;
        }
      } else {
        // Tab visible
        if (wasMusicPlaying) {
          this.bgm.play();
        }
      }
    });

    // Debug: Toggle directional light helper with Ctrl+Alt+D (or Cmd+Alt+D on Mac)
    window.addEventListener("keydown", ((event) => {
      if ((event.ctrlKey || event.metaKey) && event.altKey && event.code === "KeyD") {
        this.dirLightHelper.visible = !this.dirLightHelper.visible;
      }
    }).bind(this));

    // Window Resize
    window.addEventListener("resize", () => this.onWindowResize(), false);
  }

  setupMouseDown() {
    let mouseDownPos = {};
    let mouseUpListenerAdded = false;
    let isSwitching = false;
    let wasAudioPlaying = false;
    let wasCameraActive = false;

    document.addEventListener("mousedown", async (event) => {
      this.isMouseDown = true;
      mouseDownPos = { x: this.mx, y: this.my };
      this.canvas.style.cursor = this.isMouseOnChar ? "pointer" : "grab";

      // Add mouseup listener once
      if (!mouseUpListenerAdded) {
        mouseUpListenerAdded = true;
        document.addEventListener("mouseup", handleMouseUp);
      }

      // Only process left mouse button and not already switching
      if (event.button !== 0 || isSwitching) return;

      const button = event.target.closest('[role="button"]');
      if (button) {
        // Handle character switching buttons
        if (button.classList.contains("switch-char")) {
          isSwitching = true;
          await this.updatePageForChar(button.classList[ button.classList.length - 1 ], button);
          isSwitching = false;
          return;
        }

        switch (button.id) {
          case "switch-mat":
            isSwitching = true;
            document.body.classList.add("switch-mat-loading");
            this.useThreeMat = !this.useThreeMat;
            await toggleMaterialMode();

            if (this.useThreeMat) {
              // Switching to Three.js materials
              fadeOutAudio(this.bgm);
              wasAudioPlaying = !this.bgm.paused;
              wasCameraActive = videoCameraElement.style.display === "block";
              toggleCamera(false);
            } else {
              // Switching to custom shader materials
              playVoiceline(true);
              if (wasAudioPlaying) fadeInAudio(this.bgm);
              if (wasCameraActive) toggleCamera(true);
            }

            document.body.classList.remove("switch-mat-loading");
            isSwitching = false;
            break;

          case "toggle-camera":
            if (this.useThreeMat) return;
            toggleCamera();
            break;

          case "switch-skin":
            if (this.useThreeMat) return;
            isSwitching = true;

            switch (this.charName) {
              case "Galbrena":
                document.body.classList.add("switch-skin-loading");

                if (button.classList.contains("galbrena-2")) {
                  // Switch back to base skin
                  this.mesh.material = this.cachedMats[ `${this.charName}${this.useThreeMat}` ];
                  this.cMesh.material = this.cachedMats[ `${this.charName}Outlines` ];
                  this.skin = [ this.charName, this.activeChar.texPrefix ];
                  button.classList.remove("galbrena-2");
                } else {
                  // Switch to Galbrena-2 variant
                  await this.switchSkin("Galbrena-2", "T_NHT1CalbrenaChaopin",
                    [ "Bangs", "Down", "Eye", "Hair", "Up" ]);
                  button.classList.add("galbrena-2");
                }

                playVoiceline(true);
                break;

              case "Denia":
              case "Denia_2":
                document.body.classList.add("switch-skin-loading");

                if (this.charName === "Denia") {
                  document.querySelector(".switch-char.denia").classList.add("denia_2");
                  await this.updatePageForChar("Denia_2");
                } else {
                  document.querySelector(".switch-char.denia").classList.remove("denia_2");
                  await this.updatePageForChar("Denia");
                }
            }

            document.body.classList.remove("switch-skin-loading");
            document.body.classList.remove("switch-skin-loading");
            isSwitching = false;
            break;

          case "switch-skin-2":
            if (this.useThreeMat) return;
            isSwitching = true;
            document.body.classList.add("switch-skin-2-loading");

            if (this.charName === "Denia") {
              document.querySelector(".switch-char.denia").classList.add("denia_3");
              await this.updatePageForChar("Denia_3");
            } else {
              document.querySelector(".switch-char.denia").classList.remove("denia_3");
              await this.updatePageForChar("Denia");
            }

            document.body.classList.remove("switch-skin-2-loading");
            isSwitching = false;
            break;

          case "go-fullscreen":
            const doc = window.document;
            const docElement = doc.documentElement;
            const requestFullscreen = docElement.requestFullscreen ||
              docElement.mozRequestFullScreen ||
              docElement.webkitRequestFullScreen ||
              docElement.msRequestFullscreen;
            const exitFullscreen = doc.exitFullscreen ||
              doc.mozCancelFullScreen ||
              doc.webkitExitFullscreen ||
              doc.msExitFullscreen;

            if (doc.fullscreenElement ||
              doc.mozFullScreenElement ||
              doc.webkitFullscreenElement ||
              doc.msFullscreenElement) {
              exitFullscreen.call(doc);
            } else {
              requestFullscreen.call(docElement);
            }
            break;

          case "switch-palette":
            if (this.useThreeMat) return;
            this.paletteIndex++;
            if (this.paletteIndex >= this.PALETTES.length) {
              this.paletteIndex = 0;
            }
            this.updatePalette(this.PALETTES[ this.paletteIndex ]);
            playVoiceline(true);
            break;

          case "toggle-music":
            if (this.useThreeMat) return;
            if (this.bgm.paused) {
              fadeInAudio(this.bgm);
            } else {
              fadeOutAudio(this.bgm);
            }
        }
      }
    });

    let isDragging = false;

    const handleMouseUp = (event) => {
      if (event.button === 0) {
        this.isMouseDown = false;
        isDragging = Math.abs(this.mx - mouseDownPos.x) > 10 ||
          Math.abs(this.my - mouseDownPos.y) > 10;
        this.canvas.style.cursor = this.isMouseOnChar ? "pointer" : "default";
        if (!this.useThreeMat) playVoiceline();
      }
    };

    const toggleMaterialMode = async () => {
      document.body.classList.toggle("use-three-mat");

      if (this.useThreeMat) {
        // Switch to Three.js materials (simpler)
        this.dirLight.intensity = 1;
        this.ambientLight.intensity = 1;
        this.clone.visible = false;
        this.headBone.quaternion.identity();
        this.inf[ this.dict.E_Close ] = 0;

        for (const pupilSuffix of [ "_L", "_R", "_Up", "_Down" ]) {
          this.inf[ this.dict[ `Pupil${pupilSuffix}` ] ] = 0;
        }
      } else {
        // Switch to custom shader materials
        this.dirLight.intensity = this.DIR_LIGHT_INTENSITY;
        this.ambientLight.intensity = 1;
        this.clone.visible = true;
      }

      await this.applyMats();
    };

    this.videoBgWrapper = document.querySelector(".video-bg-wrapper");
    const videoCameraElement = this.videoBgWrapper.querySelector("#video-bg");
    let mediaStream = null;

    const toggleCamera = async (forceState = null) => {
      if (mediaStream &&
        (forceState === false ||
          (forceState === null && videoCameraElement.style.display === "block"))) {
        // Stop camera
        mediaStream.getVideoTracks()[ 0 ].stop();
        videoCameraElement.style.display = "none";
        this.bloomPass.enabled = true;
        this.ambientLight.intensity = 1;
        videoCameraElement.srcObject = null;
        videoCameraElement.pause();
      } else if (forceState === true ||
        (forceState === null && videoCameraElement.style.display === "none")) {
        // Start camera
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } }
          });
          videoCameraElement.srcObject = mediaStream;

          await new Promise((resolve) => {
            videoCameraElement.onloadedmetadata = resolve;
          });

          this.videoBgWrapper.style.aspectRatio = videoCameraElement.videoWidth / videoCameraElement.videoHeight;
          this.videoBgWrapper.style.width = window.innerWidth > window.innerHeight ? "100%" : "auto";
          this.videoBgWrapper.style.height = window.innerWidth > window.innerHeight ? "auto" : "100%";

          videoCameraElement.play();
          videoCameraElement.style.display = "block";
          this.bloomPass.enabled = false;
          this.ambientLight.intensity = 2.4;
          playVoiceline(true);
        } catch (error) {
          // Camera access denied
        }
      }
    };

    let isPlayingAudio = false;
    let lastVoicelineIndex = -1;
    let voicelineIndexByCharacter = [];

    const playVoiceline = (forcePlay = false, useIntroVoiceline = false) => {
      if (!this.isFullyVisible || isPlayingAudio) return;

      const voicelines = this.activeChar.voicelines;
      if (!voicelines) return;

      if (!forcePlay) {
        if (isDragging || !this.isMouseOnChar) return;
      }

      let audioElement = null;

      // Play intro voiceline if requested
      if (useIntroVoiceline) {
        const introVoicelines = this.activeChar.introVoicelines;
        if (introVoicelines) {
          let randomIndex = -1;
          do {
            randomIndex = Math.floor(Math.random() * introVoicelines.length);
          } while (randomIndex === voicelineIndexByCharacter[ this.activeChar.voicelinesPath ]);

          audioElement = new Audio(
            `${this.VOICES_PATH}${this.activeChar.voicelinesPath}/${introVoicelines[ randomIndex ]}.mp3`
          );
          voicelineIndexByCharacter[ this.activeChar.voicelinesPath ] = randomIndex;
        }
      }

      // Play random voiceline
      if (!audioElement) {
        let randomIndex = -1;

        if (voicelines.length >= 5) {
          do {
            randomIndex = Math.floor(Math.random() * voicelines.length);
          } while (randomIndex === lastVoicelineIndex);
        } else {
          lastVoicelineIndex++;
          randomIndex = lastVoicelineIndex >= voicelines.length ? 0 : lastVoicelineIndex;
        }

        audioElement = new Audio(
          `${this.VOICES_PATH}${this.activeChar.voicelinesPath}/${voicelines[ randomIndex ]}.mp3`
        );
        lastVoicelineIndex = randomIndex;
      }

      audioElement.play();
      isPlayingAudio = true;
      audioElement.addEventListener("ended", () => { isPlayingAudio = false; }, { once: true });
      audioElement.addEventListener("error", () => { isPlayingAudio = false; }, { once: true });
    };

    this.setupMouseDown.playVoiceline = playVoiceline;

    let fadeOutTracking = {};
    let animationFrameIds = {};

    const fadeOutAudio = (audioElement, fadeDuration = 0.3) => {
      if (fadeOutTracking[ audioElement.id ]) return;
      fadeOutTracking[ audioElement.id ] = true;

      const startVolume = audioElement.volume;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsedSeconds = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsedSeconds / fadeDuration, 1);

        audioElement.volume = startVolume * (1 - progress);

        if (progress < 1) {
          animationFrameIds[ audioElement.id ] = requestAnimationFrame(animate);
        } else {
          audioElement.pause();
          audioElement.volume = startVolume;
          fadeOutTracking[ audioElement.id ] = false;
        }
      };

      animationFrameIds[ audioElement.id ] = requestAnimationFrame(animate);
    };

    const fadeInAudio = (audioElement) => {
      cancelAnimationFrame(animationFrameIds[ audioElement.id ]);
      fadeOutTracking[ audioElement.id ] = false;
      audioElement.volume = this.bgm.getAttribute("data-vol");
      audioElement.play();
    };
  }

  setupMouseFollow() {
    // Initialize function to get morph targets and head bone
    const initializeMouseFollow = () => {
      // Get morph target influences and dictionary from mesh
      this.inf = this.mesh.morphTargetInfluences;
      this.dict = this.mesh.morphTargetDictionary;

      // Get head bone (supports multiple locale names)
      this.headBone = this.mesh.skeleton.getBoneByName("Bip001Head") ||
        this.mesh.skeleton.getBoneByName("頭");

      // Reset head rotation to identity
      this.headBone.quaternion.identity();

      // Get head's world position
      this.headPos = new THREE.Vector3();
      this.headBone.getWorldPosition(this.headPos);
    };

    // Store init function for later use
    this.setupMouseFollow.init = initializeMouseFollow;
    initializeMouseFollow();

    // Setup raycasting for mouse-over detection
    this.raycaster = new THREE.Raycaster();
    this.mouseVec2 = new THREE.Vector2();

    // Update mouse position and detect if hovering over character
    this.updateMouse = (event) => {
      // Get mouse position from mouse or touch event
      this.mx = event.clientX || event.changedTouches?.[ 0 ]?.clientX || this.mx;
      this.my = event.clientY || event.changedTouches?.[ 0 ]?.clientY || this.my;

      // Initialize lerp positions on first mouse move
      if (!this.lmx) {
        this.lmx = this.mx;
        this.lmy = this.my;
      }

      // Skip raycasting if using simplified materials
      if (!this.useThreeMat) {
        // Convert screen coordinates to normalized device coordinates (-1 to 1)
        this.mouseVec2.x = 2 * (this.mx / window.innerWidth - 0.5);
        this.mouseVec2.y = -2 * (this.my / window.innerHeight - 0.5);

        // Cast ray from camera through mouse position
        this.raycaster.setFromCamera(this.mouseVec2, this.camera);

        // Check if ray intersects with character hitbox
        this.isMouseOnChar = this.raycaster.intersectObject(this.hitbox).length > 0;

        // Update cursor based on state
        if (this.isMouseOnChar) {
          this.canvas.style.cursor = this.isMouseDown ? "grabbing" : "pointer";
        } else {
          this.canvas.style.cursor = this.isMouseDown ? "grabbing" : "default";
        }
      }
    };

    // Bind updateMouse to preserve 'this' context
    this.updateMouseBound = this.updateMouse.bind(this);

    // Listen for mouse movement
    window.addEventListener("mousemove", this.updateMouseBound);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.bloomPass.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.videoBgWrapper.style.width = window.innerWidth > window.innerHeight ? "100%" : "auto";
    this.videoBgWrapper.style.height = window.innerWidth > window.innerHeight ? "auto" : " 100%";
  }

  animate() {
    requestAnimationFrame(this.animateBound);
    this.timer.update();
    const elapsedTime = this.timer.getElapsed();
    const dirLightPos = this.dirLight.target.position;
    this.dirLight.position.set(
      dirLightPos.x + Math.cos(0.333 * -elapsedTime + Math.PI) * this.DIR_LIGHT_RADIUS * 1,
      dirLightPos.y,
      dirLightPos.z + Math.sin(0.333 * -elapsedTime + Math.PI) * this.DIR_LIGHT_RADIUS
    );
    this.dirLightHelper.visible && this.dirLightHelper.update();
    if (this.useThreeMat) {
      this.renderer.render(this.scene, this.camera)
    } else {
      this.blink(elapsedTime);
      this.followMouse();
      this.composer.render();
    }
  }

  isFacingCamera() {
    // Direction from character to camera
    const cameraDirection = new THREE.Vector3()
      .subVectors(this.camera.position, this.mesh.position)
      .normalize();

    // Character's up vector in world space
    const characterUp = new THREE.Vector3(0, 1, 0)
      .applyQuaternion(this.mesh.getWorldQuaternion(new THREE.Quaternion()));

    // Calculate dot product (determines if facing camera)
    const dotProduct = cameraDirection.dot(characterUp);

    // Return true if facing camera (or inverted if flipIsFacingCamera is true)
    return this.activeChar.flipIsFacingCamera
      ? dotProduct <= 0
      : dotProduct > 0;
  }

  followMouse() {
    // Skip if touch swiping or mouse hasn't moved
    if (this.doNotFollowTouch && this.lastMx === this.mx && this.lastMy === this.my) {
      return;
    }

    // Smoothly interpolate mouse position with lerp
    this.lmx = this.lerp(this.lmx, this.mx, this.followMouseLerp);
    this.lmx = Math.floor(100 * this.lmx) / 100;  // Round to 2 decimal places

    this.lmy = this.lerp(this.lmy, this.my, this.followMouseLerp);
    this.lmy = Math.floor(100 * this.lmy) / 100;  // Round to 2 decimal places

    // Convert screen coordinates to normalized device coordinates (-1 to 1)
    const normalizedMouseX = 2 * (this.lmx / window.innerWidth - 0.5);
    const normalizedMouseY = -2 * (this.lmy / window.innerHeight - 0.5);

    // Project head position to screen space
    const headScreenPos = this.headPos.clone().project(this.camera);
    const deltaX = normalizedMouseX - headScreenPos.x;
    const deltaY = normalizedMouseY - headScreenPos.y;

    // Control left/right pupil movement
    if (deltaX > 0) {
      // Mouse to the right: move left pupil
      this.inf[ this.dict.Pupil_L ] = Math.min(deltaX * this.EYE_MAX_X, this.EYE_MAX_X);
      this.inf[ this.dict.Pupil_R ] = 0;
    } else {
      // Mouse to the left: move right pupil
      this.inf[ this.dict.Pupil_R ] = Math.min(-deltaX * this.EYE_MAX_X, this.EYE_MAX_X);
      this.inf[ this.dict.Pupil_L ] = 0;
    }

    // Control up/down pupil movement
    if (deltaY > 0) {
      // Mouse above: move pupils up
      this.inf[ this.dict.Pupil_Up ] = Math.min(deltaY * this.EYE_MAX_Y, this.EYE_MAX_Y);
      this.inf[ this.dict.Pupil_Down ] = 0;
    } else {
      // Mouse below: move pupils down
      this.inf[ this.dict.Pupil_Down ] = Math.min(-deltaY * this.EYE_MAX_Y, this.EYE_MAX_Y);
      this.inf[ this.dict.Pupil_Up ] = 0;
    }

    // Rotate head to follow mouse
    this.headBone.rotation[ this.activeChar.headRotAxis ] =
      deltaX * this.HEAD_MAX_Y * (this.isFacingCamera() ? 1 : -1);

    this.headBone.rotation[ this.activeChar.headRotAxisUpDown || "z" ] =
      -deltaY * this.HEAD_MAX_X;
  }

  blink(currentTime) {
    const elapsedSinceLastBlink = currentTime - this.lastBlink;

    // Start new blink if enough time has passed and eyes aren't already closed
    if (elapsedSinceLastBlink > this.blinkInterval && this.inf[ this.dict.E_Close ] === 0) {
      // Randomize blink duration (add natural variation)
      this.blinkDur = (this.BLINK_DUR * (0.2 * Math.random() + 0.2)) / 0.3;

      // Randomize blink curve weights for natural motion
      this.blinkWeights = [
        Math.random() * (1.35 - 1.05) + 1.05,  // Close speed multiplier (1.05-1.35)
        Math.random() * (0.45 - 0.3) + 0.3,    // Open speed multiplier (0.3-0.45)
        Math.random() * (1.65 - 1.35) + 1.35,  // Pause duration multiplier (1.35-1.65)
      ];

      this.lastBlink = currentTime;
      this.blinkInterval = 7.5 * Math.random() + 7.5;  // Next blink in 7.5-15 seconds
      return;
    }

    // Calculate key timing points in the blink animation
    const closingPhase = this.blinkDur * this.blinkWeights[ 0 ] * 2 * this.blinkWeights[ 1 ];

    // Phase 1: Close eyes (0 to closingPhase)
    if (elapsedSinceLastBlink < this.blinkDur * this.blinkWeights[ 0 ]) {
      this.inf[ this.dict.E_Close ] = Math.min(1, elapsedSinceLastBlink / this.blinkDur);
    }
    // Phase 2: Eyes fully closed (closingPhase to closingPhase + dwell)
    else if (elapsedSinceLastBlink < closingPhase) {
      this.inf[ this.dict.E_Close ] = 1;
    }
    // Phase 3: Open eyes (closingPhase + dwell to complete)
    else if (elapsedSinceLastBlink < 1.5 * closingPhase * this.blinkWeights[ 2 ]) {
      const timeIntoOpening = elapsedSinceLastBlink - closingPhase;
      this.inf[ this.dict.E_Close ] = Math.max(0, 1 - timeIntoOpening / this.blinkDur);
    }
    // Phase 4: Eyes fully open
    else {
      this.inf[ this.dict.E_Close ] = 0;
    }
  }
}

document.body.style.setProperty("--spinner", Math.max(1.13, (1.13 / 1358) * window.innerWidth));
const app = new App();
document.addEventListener("DOMContentLoaded", () => app.init());

//=====================================================================================================================//