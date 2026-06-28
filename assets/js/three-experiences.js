/* Cork Jar: 3D photo gallery (Three.js, lazy-loaded from CDN).
   A bright, minimal museum room. The camera glides from artwork to
   artwork around the room. Photos use unlit materials so they are
   always perfectly visible (no dark squares), with a light placeholder
   and an error fallback. Custom controls, no extra libraries. */

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

  var built = false,
    state = null;

  function buildGallery3D(THREE, items) {
    var overlay = document.createElement("div");
    overlay.className = "gallery3d";
    overlay.innerHTML =
      '<button class="g3d-exit" type="button">Exit</button>' +
      '<div class="g3d-hint">Scroll or drag to walk the room  &middot;  click a photo to enlarge  &middot;  Esc to exit</div>';
    document.body.appendChild(overlay);

    var scene = new THREE.Scene();
    scene.background = gradientTexture(THREE, [
      [0, "#f4f2ec"],
      [1, "#e4e1d8"],
    ]);

    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    overlay.insertBefore(renderer.domElement, overlay.firstChild);

    var camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200,
    );

    // ---- bright, even museum lighting ----
    scene.add(new THREE.HemisphereLight(0xfff7ec, 0xcfcdc8, 1.05));
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    var dir = new THREE.DirectionalLight(0xffffff, 0.5);
    dir.position.set(0, 8, 3);
    scene.add(dir);

    // ---- room geometry from the photo count ----
    var n = items.length;
    var H = 6; // wall height
    var approxSpacing = 4.3;
    var P = n * approxSpacing; // perimeter target
    var halfL = (P * 0.3) / 1; // longer sides
    var halfW = P * 0.2;
    halfL = Math.max(halfL, 8);
    halfW = Math.max(halfW, 6);
    var W2 = 2 * halfW,
      L2 = 2 * halfL;
    var perim = 2 * (W2 + L2);
    var spacing = perim / n;
    var viewDist = 4.7;

    // perimeter walker -> wall point + inward normal
    var edges = [
      { x: -halfW, z: -halfL, dx: 1, dz: 0, nx: 0, nz: 1, len: W2 }, // top
      { x: halfW, z: -halfL, dx: 0, dz: 1, nx: -1, nz: 0, len: L2 }, // right
      { x: halfW, z: halfL, dx: -1, dz: 0, nx: 0, nz: -1, len: W2 }, // bottom
      { x: -halfW, z: halfL, dx: 0, dz: -1, nx: 1, nz: 0, len: L2 }, // left
    ];
    function pointAt(d) {
      var dd = ((d % perim) + perim) % perim;
      for (var i = 0; i < edges.length; i++) {
        var e = edges[i];
        if (dd <= e.len) {
          return {
            x: e.x + e.dx * dd,
            z: e.z + e.dz * dd,
            nx: e.nx,
            nz: e.nz,
          };
        }
        dd -= e.len;
      }
      return { x: 0, z: 0, nx: 0, nz: 1 };
    }

    // ---- walls / floor / ceiling ----
    var wallMat = new THREE.MeshStandardMaterial({
      color: 0xeae7e0,
      roughness: 0.95,
      metalness: 0,
    });
    function wall(w, cx, cz, ry) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(w, H), wallMat);
      m.position.set(cx, 0, cz);
      m.rotation.y = ry;
      scene.add(m);
    }
    wall(W2, 0, -halfL, 0); // top faces +z
    wall(W2, 0, halfL, Math.PI); // bottom faces -z
    wall(L2, halfW, 0, -Math.PI / 2); // right faces -x
    wall(L2, -halfW, 0, Math.PI / 2); // left faces +x
    var floor = new THREE.Mesh(
      new THREE.PlaneGeometry(W2 + 2, L2 + 2),
      new THREE.MeshStandardMaterial({ color: 0xd9d7d1, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -H / 2;
    scene.add(floor);
    var ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(W2 + 2, L2 + 2),
      new THREE.MeshStandardMaterial({ color: 0xf4f2ec, roughness: 1 }),
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = H / 2;
    scene.add(ceil);

    // ---- photos as framed, unlit artworks ----
    var maxAniso = renderer.capabilities.getMaxAnisotropy();
    var loader = new THREE.TextureLoader();
    var photos = [];
    var stations = [];
    var MAXH = 2.6;

    items.forEach(function (it, i) {
      var d = (i + 0.5) * spacing;
      var p = pointAt(d);
      var ry = Math.atan2(p.nx, p.nz);
      stations.push({
        cam: new THREE.Vector3(p.x + p.nx * viewDist, 0, p.z + p.nz * viewDist),
        look: new THREE.Vector3(p.x, 0, p.z),
      });

      // soft warm spotlight wash on the wall behind the piece
      var wash = new THREE.Mesh(
        new THREE.PlaneGeometry(MAXH * 1.9, MAXH * 1.9),
        new THREE.MeshBasicMaterial({
          color: 0xfff3df,
          transparent: true,
          opacity: 0.5,
        }),
      );
      wash.position.set(p.x + p.nx * 0.01, 0.2, p.z + p.nz * 0.01);
      wash.rotation.y = ry;
      scene.add(wash);

      var frame = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ color: 0x1b1b1d }),
      );
      var mat = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ color: 0xfbfaf6 }),
      );
      // photo: light placeholder until the texture loads (never black)
      var photoMat = new THREE.MeshBasicMaterial({
        color: 0xcfccc4,
        toneMapped: false,
      });
      var photo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), photoMat);
      photo.userData.index = i;
      photo.userData.mult = 1;
      photo.userData.target = 1;

      function place(w, h) {
        photo.userData.w = w;
        photo.userData.h = h;
        photo.scale.set(w, h, 1);
        mat.scale.set(w + 0.18, h + 0.18, 1);
        frame.scale.set(w + 0.34, h + 0.34, 1);
        [photo, mat, frame].forEach(function (o) {
          o.rotation.y = ry;
        });
        frame.position.set(p.x + p.nx * 0.03, 0, p.z + p.nz * 0.03);
        mat.position.set(p.x + p.nx * 0.05, 0, p.z + p.nz * 0.05);
        photo.position.set(p.x + p.nx * 0.07, 0, p.z + p.nz * 0.07);
      }
      place(MAXH * 1.4, MAXH); // sensible default before load

      loader.load(
        it.src,
        function (t) {
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = maxAniso;
          photoMat.map = t;
          photoMat.color.set(0xffffff);
          photoMat.needsUpdate = true;
          var ar = t.image.width / t.image.height;
          var h = MAXH,
            w = h * ar;
          if (w > spacing * 0.82) {
            w = spacing * 0.82;
            h = w / ar;
          }
          place(w, h);
        },
        undefined,
        function () {
          photoMat.color.set(0x9a978f); // graceful fallback block
        },
      );

      scene.add(frame);
      scene.add(mat);
      scene.add(photo);
      photos.push(photo);
    });

    // ---- navigation: glide between stations ----
    var pos = 0,
      tpos = 0;
    function setCam() {
      var base = Math.floor(pos);
      var f = pos - base;
      var a = stations[((base % n) + n) % n];
      var b = stations[(((base + 1) % n) + n) % n];
      camera.position.lerpVectors(a.cam, b.cam, f);
      var look = new THREE.Vector3().lerpVectors(a.look, b.look, f);
      camera.lookAt(look);
    }
    setCam();

    overlay.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
        tpos += e.deltaY * 0.0024;
      },
      { passive: false },
    );

    var dragging = false,
      downX = 0,
      downY = 0,
      lastX = 0,
      moved = false;
    function down(x, y) {
      dragging = true;
      downX = lastX = x;
      downY = y;
      moved = false;
    }
    function move(x) {
      if (!dragging) return;
      tpos -= (x - lastX) * 0.01;
      lastX = x;
      if (Math.abs(x - downX) > 6) moved = true;
    }
    function up() {
      dragging = false;
    }
    renderer.domElement.addEventListener("mousedown", function (e) {
      down(e.clientX, e.clientY);
    });
    window.addEventListener("mousemove", function (e) {
      move(e.clientX);
      hoverX = e.clientX;
      hoverY = e.clientY;
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
        move(e.touches[0].clientX);
      },
      { passive: true },
    );
    window.addEventListener("touchend", up);

    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("open")) return;
      if (e.key === "Escape") closeGallery3D();
      else if (e.key === "ArrowRight" || e.key === "ArrowDown") tpos += 1;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") tpos -= 1;
    });

    // ---- hover focus + click to enlarge ----
    var ray = new THREE.Raycaster(),
      ndc = new THREE.Vector2(),
      hoverX = -1,
      hoverY = -1,
      hovered = -1;
    function pick(cx, cy) {
      ndc.x = (cx / window.innerWidth) * 2 - 1;
      ndc.y = -(cy / window.innerHeight) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      var hit = ray.intersectObjects(photos)[0];
      return hit ? hit.object : null;
    }
    renderer.domElement.addEventListener("click", function (e) {
      if (moved) return;
      var o = pick(e.clientX, e.clientY);
      if (o) {
        var idx = o.userData.index;
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

    function loop() {
      requestAnimationFrame(loop);
      pos += (tpos - pos) * 0.08; // smooth glide
      setCam();
      // hover focus
      var o = hoverX >= 0 ? pick(hoverX, hoverY) : null;
      hovered = o ? o.userData.index : -1;
      renderer.domElement.style.cursor = o ? "pointer" : "grab";
      photos.forEach(function (ph) {
        ph.userData.target = ph.userData.index === hovered ? 1.06 : 1;
        ph.userData.mult += (ph.userData.target - ph.userData.mult) * 0.12;
        ph.scale.set(
          ph.userData.w * ph.userData.mult,
          ph.userData.h * ph.userData.mult,
          1,
        );
      });
      renderer.render(scene, camera);
    }
    loop();

    state = { overlay: overlay };
    built = true;
  }

  function openGallery3D() {
    var items = window.CJ_WORK_CURRENT || window.CJ_WORK_ALL || [];
    if (!items.length) return;
    if (!built) {
      loadThree()
        .then(function (THREE) {
          buildGallery3D(THREE, items);
          requestAnimationFrame(function () {
            state.overlay.classList.add("open");
            document.body.style.overflow = "hidden";
          });
        })
        .catch(function () {});
    } else {
      state.overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }
  function closeGallery3D() {
    if (state) state.overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("gallery3d-open");
    if (btn) btn.addEventListener("click", openGallery3D);
  });
})();
