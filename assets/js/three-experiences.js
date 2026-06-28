/* Cork Jar: 3D experiences (Three.js, lazy-loaded from CDN)
   - initCamera3D(): an interactive stylized camera on the Gear page
   - 3D gallery: a walk-through corridor of the real photos on the Work page
   Custom lightweight controls, no extra libs. Degrades gracefully. */

(function () {
  "use strict";
  var THREE_URL =
    "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var _three = null;
  function loadThree() {
    if (_three) return Promise.resolve(_three);
    return import(THREE_URL).then(function (m) {
      _three = m;
      return m;
    });
  }

  function gradientTexture(THREE, stops) {
    var c = document.createElement("canvas");
    c.width = 16;
    c.height = 256;
    var ctx = c.getContext("2d");
    var g = ctx.createLinearGradient(0, 0, 0, 256);
    stops.forEach(function (s) {
      g.addColorStop(s[0], s[1]);
    });
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 16, 256);
    var t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /* ----------------------------------------------- stylized 3D camera */
  function buildCamera(THREE) {
    var g = new THREE.Group();
    var metal = function (c, m, r) {
      return new THREE.MeshStandardMaterial({
        color: c,
        metalness: m == null ? 0.6 : m,
        roughness: r == null ? 0.45 : r,
      });
    };
    var bodyMat = metal(0x2a2d33, 0.55, 0.5);
    var darkMat = metal(0x191b1f, 0.6, 0.45);
    var amberMat = metal(0xd6a35c, 0.9, 0.3);

    var body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.35, 0.72), bodyMat);
    g.add(body);
    var top = new THREE.Mesh(new THREE.BoxGeometry(2.12, 0.2, 0.74), darkMat);
    top.position.y = 0.77;
    g.add(top);
    var grip = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.36, 0.78), darkMat);
    grip.position.x = 1.02;
    g.add(grip);
    var hump = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.34, 0.5), darkMat);
    hump.position.set(-0.45, 0.95, 0);
    g.add(hump);
    var shoe = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.08, 0.3),
      metal(0x33363c, 0.5, 0.5),
    );
    shoe.position.set(-0.45, 1.16, 0);
    g.add(shoe);
    var shutter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.08, 24),
      amberMat,
    );
    shutter.position.set(0.62, 0.9, 0.18);
    g.add(shutter);
    var dial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.14, 28),
      metal(0x3a3d44, 0.6, 0.4),
    );
    dial.position.set(0.3, 0.9, -0.18);
    g.add(dial);

    var lens = new THREE.Group();
    var barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.52, 0.56, 0.95, 56),
      metal(0x17191d, 0.65, 0.4),
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.z = 0.78;
    lens.add(barrel);
    var ring1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.575, 0.575, 0.1, 56),
      metal(0x101216, 0.5, 0.6),
    );
    ring1.rotation.x = Math.PI / 2;
    ring1.position.z = 0.7;
    lens.add(ring1);
    var accentRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.585, 0.585, 0.05, 56),
      amberMat,
    );
    accentRing.rotation.x = Math.PI / 2;
    accentRing.position.z = 1.06;
    lens.add(accentRing);
    var glass = new THREE.Mesh(
      new THREE.CircleGeometry(0.46, 48),
      new THREE.MeshStandardMaterial({
        color: 0x0a1016,
        metalness: 0.9,
        roughness: 0.08,
        emissive: 0x16323a,
        emissiveIntensity: 0.5,
      }),
    );
    glass.position.z = 1.27;
    lens.add(glass);
    g.add(lens);

    g.rotation.y = -0.5;
    g.rotation.x = 0.1;
    return g;
  }

  function initCamera3D(container) {
    loadThree()
      .then(function (THREE) {
        var loading = container.querySelector(".three-loading");
        if (loading) loading.remove();
        var w = container.clientWidth,
          h = container.clientHeight;
        var scene = new THREE.Scene();
        scene.background = gradientTexture(THREE, [
          [0, "#1b3a42"],
          [0.55, "#23262c"],
          [1, "#3a2a1e"],
        ]);
        var camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100);
        camera.position.set(0, 0.4, 6.4);
        var renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
        renderer.setSize(w, h);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0x4a4f58, 0.8));
        var key = new THREE.DirectionalLight(0xffffff, 1.2);
        key.position.set(3, 5, 4);
        scene.add(key);
        var rim = new THREE.DirectionalLight(0x5aa6b0, 1.0);
        rim.position.set(-4, 2, -3);
        scene.add(rim);
        var fill = new THREE.PointLight(0xd6a35c, 0.6, 30);
        fill.position.set(2, -2, 3);
        scene.add(fill);

        var cam = buildCamera(THREE);
        scene.add(cam);

        var dragging = false,
          px = 0,
          py = 0,
          tY = cam.rotation.y,
          tX = cam.rotation.x,
          idle = 0;
        function down(x, y) {
          dragging = true;
          px = x;
          py = y;
          idle = 0;
        }
        function move(x, y) {
          if (!dragging) return;
          tY += (x - px) * 0.01;
          tX += (y - py) * 0.01;
          tX = Math.max(-0.8, Math.min(0.8, tX));
          px = x;
          py = y;
          idle = 0;
        }
        function up() {
          dragging = false;
        }
        renderer.domElement.addEventListener("mousedown", function (e) {
          down(e.clientX, e.clientY);
        });
        window.addEventListener("mousemove", function (e) {
          move(e.clientX, e.clientY);
        });
        window.addEventListener("mouseup", up);
        renderer.domElement.addEventListener(
          "touchstart",
          function (e) {
            down(e.touches[0].clientX, e.touches[0].clientY);
          },
          { passive: true },
        );
        renderer.domElement.addEventListener(
          "touchmove",
          function (e) {
            move(e.touches[0].clientX, e.touches[0].clientY);
          },
          { passive: true },
        );
        window.addEventListener("touchend", up);

        window.addEventListener("resize", function () {
          var W = container.clientWidth,
            H = container.clientHeight;
          camera.aspect = W / H;
          camera.updateProjectionMatrix();
          renderer.setSize(W, H);
        });

        function loop() {
          requestAnimationFrame(loop);
          idle++;
          if (!dragging && idle > 90 && !reduce) tY += 0.0035;
          cam.rotation.y += (tY - cam.rotation.y) * 0.08;
          cam.rotation.x += (tX - cam.rotation.x) * 0.08;
          renderer.render(scene, camera);
        }
        loop();
      })
      .catch(function () {
        var l = container.querySelector(".three-loading");
        if (l) l.textContent = "3D view unavailable";
      });
  }

  /* ------------------------------------- walk-through 3D photo gallery */
  var g3dBuilt = false,
    g3dState = null;
  function buildGallery3D(THREE, items) {
    var overlay = document.createElement("div");
    overlay.className = "gallery3d";
    overlay.innerHTML =
      '<button class="g3d-exit" type="button">Exit</button>' +
      '<div class="g3d-hint">Scroll to walk forward  &middot;  drag to look  &middot;  click a photo to enlarge  &middot;  Esc to exit</div>';
    document.body.appendChild(overlay);

    var scene = new THREE.Scene();
    scene.background = gradientTexture(THREE, [
      [0, "#16323a"],
      [0.5, "#262a30"],
      [1, "#3a2a1e"],
    ]);
    scene.fog = new THREE.FogExp2(0x20242a, 0.018);

    var camera = new THREE.PerspectiveCamera(
      68,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    overlay.insertBefore(renderer.domElement, overlay.firstChild);

    var maxAniso = renderer.capabilities.getMaxAnisotropy();
    var loader = new THREE.TextureLoader();
    var SP = 6.2; // spacing along the corridor
    var XW = 4.3; // wall offset
    var planes = [];
    var n = items.length;

    items.forEach(function (it, i) {
      var left = i % 2 === 0;
      var x = left ? -XW : XW;
      var z = -i * SP;
      var tex = loader.load(it.src, function (t) {
        t.anisotropy = maxAniso;
        var ar = t.image.width / t.image.height;
        var hh = 3.4,
          ww = hh * ar;
        mesh.scale.set(ww, hh, 1);
        frame.scale.set(ww + 0.22, hh + 0.22, 1);
      });
      tex.colorSpace = THREE.SRGBColorSpace;
      var frame = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ color: 0x07080a }),
      );
      var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }),
      );
      var ry = left ? Math.PI / 2 - 0.32 : -Math.PI / 2 + 0.32;
      frame.position.set(x, 0, z);
      mesh.position.set(x + (left ? 0.02 : -0.02), 0, z);
      frame.rotation.y = ry;
      mesh.rotation.y = ry;
      mesh.userData.index = i;
      scene.add(frame);
      scene.add(mesh);
      planes.push(mesh);

      // little spotlight glow above each frame for gallery ambiance
      var glow = new THREE.Mesh(
        new THREE.CircleGeometry(0.5, 24),
        new THREE.MeshBasicMaterial({
          color: left ? 0x5aa6b0 : 0xd6a35c,
          transparent: true,
          opacity: 0.16,
        }),
      );
      glow.position.set(x, 2.5, z);
      glow.rotation.x = -Math.PI / 2.2;
      scene.add(glow);
    });

    var corridorLen = (n - 1) * SP;

    // floor + ceiling + accent runners for depth
    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, corridorLen + 40),
      new THREE.MeshBasicMaterial({ color: 0x14161a }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -2.6, -corridorLen / 2);
    scene.add(floor);
    var ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(40, corridorLen + 40),
      new THREE.MeshBasicMaterial({ color: 0x1b1e23 }),
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 3.4, -corridorLen / 2);
    scene.add(ceil);
    [-XW - 0.4, XW + 0.4].forEach(function (rx, k) {
      var runner = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.06, corridorLen + 30),
        new THREE.MeshBasicMaterial({ color: k === 0 ? 0x5aa6b0 : 0xd6a35c }),
      );
      runner.position.set(rx, -2.55, -corridorLen / 2);
      scene.add(runner);
    });

    var START_Z = 5;
    camera.position.set(0, 0, START_Z);
    var targetZ = START_Z,
      yaw = 0,
      tYaw = 0;
    var minZ = -corridorLen - 4,
      maxZ = START_Z;

    // wheel / swipe = walk forward and back
    overlay.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        targetZ -= e.deltaY * 0.02;
        targetZ = Math.max(minZ, Math.min(maxZ, targetZ));
      },
      { passive: false },
    );

    var dragging = false,
      px = 0,
      py = 0,
      ty = 0;
    function down(x, y) {
      dragging = true;
      px = x;
      py = y;
      ty = y;
    }
    function move(x, y) {
      if (!dragging) return;
      tYaw += (x - px) * 0.004;
      tYaw = Math.max(-0.6, Math.min(0.6, tYaw));
      px = x;
    }
    function end(y) {
      dragging = false;
    }
    renderer.domElement.addEventListener("mousedown", function (e) {
      down(e.clientX, e.clientY);
    });
    window.addEventListener("mousemove", function (e) {
      move(e.clientX, e.clientY);
    });
    window.addEventListener("mouseup", function () {
      end();
    });
    var tStartY = 0;
    renderer.domElement.addEventListener(
      "touchstart",
      function (e) {
        down(e.touches[0].clientX, e.touches[0].clientY);
        tStartY = e.touches[0].clientY;
      },
      { passive: true },
    );
    renderer.domElement.addEventListener(
      "touchmove",
      function (e) {
        move(e.touches[0].clientX, e.touches[0].clientY);
        var dy = e.touches[0].clientY - tStartY;
        targetZ -= dy * 0.03;
        targetZ = Math.max(minZ, Math.min(maxZ, targetZ));
        tStartY = e.touches[0].clientY;
      },
      { passive: true },
    );
    window.addEventListener("touchend", function () {
      end();
    });

    // click a photo -> open the existing lightbox at that index
    var ray = new THREE.Raycaster(),
      m = new THREE.Vector2(),
      downX = 0,
      downY = 0;
    renderer.domElement.addEventListener("mousedown", function (e) {
      downX = e.clientX;
      downY = e.clientY;
    });
    renderer.domElement.addEventListener("click", function (e) {
      if (Math.abs(e.clientX - downX) > 6 || Math.abs(e.clientY - downY) > 6)
        return;
      m.x = (e.clientX / window.innerWidth) * 2 - 1;
      m.y = -(e.clientY / window.innerHeight) * 2 + 1;
      ray.setFromCamera(m, camera);
      var hit = ray.intersectObjects(planes)[0];
      if (hit) {
        var idx = hit.object.userData.index;
        closeGallery3D();
        var figs = document.querySelectorAll("#work-grid .gallery-item");
        if (figs[idx])
          setTimeout(function () {
            figs[idx].click();
          }, 280);
      }
    });

    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    overlay
      .querySelector(".g3d-exit")
      .addEventListener("click", closeGallery3D);
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") closeGallery3D();
      else if (e.key === "ArrowDown" || e.key === "ArrowRight")
        targetZ = Math.max(minZ, targetZ - SP);
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
        targetZ = Math.min(maxZ, targetZ + SP);
    });

    function loop() {
      requestAnimationFrame(loop);
      if (!reduce) targetZ -= 0.004; // gentle forward drift
      if (targetZ < minZ) targetZ = maxZ; // loop the corridor
      camera.position.z += (targetZ - camera.position.z) * 0.06;
      yaw += (tYaw - yaw) * 0.07;
      camera.rotation.y = yaw;
      renderer.render(scene, camera);
    }
    loop();

    g3dState = { overlay: overlay };
    g3dBuilt = true;
  }

  function openGallery3D() {
    var items = window.CJ_WORK_CURRENT || window.CJ_WORK_ALL || [];
    if (!items.length) return;
    if (!g3dBuilt) {
      loadThree()
        .then(function (THREE) {
          buildGallery3D(THREE, items);
          requestAnimationFrame(function () {
            g3dState.overlay.classList.add("open");
            document.body.style.overflow = "hidden";
          });
        })
        .catch(function () {});
    } else {
      g3dState.overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }
  function closeGallery3D() {
    if (g3dState) g3dState.overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* ----------------------------------------------------------- wiring */
  document.addEventListener("DOMContentLoaded", function () {
    var cam = document.getElementById("cam3d");
    if (cam) {
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(
          function (en) {
            en.forEach(function (e) {
              if (e.isIntersecting) {
                io.disconnect();
                initCamera3D(cam);
              }
            });
          },
          { threshold: 0.2 },
        );
        io.observe(cam);
      } else {
        initCamera3D(cam);
      }
    }
    var btn = document.getElementById("gallery3d-open");
    if (btn) btn.addEventListener("click", openGallery3D);
  });
})();
